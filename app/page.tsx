"use client";

import { figmaAPI } from "@/lib/figmaAPI";
import { getTextForSelection } from "@/lib/getTextForSelection";
import { getTextOffset } from "@/lib/getTextOffset";
import { CompletionRequestBody } from "@/lib/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getSelection } from "@/lib/getSelection";
import { IconType } from "@/lib/customTypes";
import Image from "next/image";
import SvgImage from "./components/SVGImage";

import { Disclosure, Tip, Title, Checkbox, Button, Icon } from "react-figma-plugin-ds";
import "react-figma-plugin-ds/figma-plugin-ds.css";


import Tab from "./components/Tab"
import FRE from "./components/FRE";

// This function calls our API and lets you read each character as it comes in.
// To change the prompt of our AI, go to `app/api/completion.ts`.
async function streamAIResponse(body: z.infer<typeof CompletionRequestBody>) {
  const resp = await fetch("/api/completion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const reader = resp.body?.pipeThrough(new TextDecoderStream()).getReader();

  if (!reader) {
    throw new Error("Error reading response");
  }

  return reader;
}

export default function Plugin() {
  const [completion, setCompletion] = useState("");

  // This function calls our API and handles the streaming response.
  // This ends up building the text up and using React state to update the UI.
  const onStreamToIFrame = async () => {
    setCompletion("");
    const layers = await getTextForSelection();

    if (!layers.length) {
      figmaAPI.run(async (figma) => {
        figma.notify(
          "Please select a layer with text in it to generate a poem.",
          { error: true },
        );
      });
      return;
    }
    
    
    //test code
    const selection = await getSelection();
    console.log("LOGGING SELECTION")
    console.log(selection)


    const reader = await streamAIResponse({
      layers,
    });

    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      text += value;
      setCompletion(text);
    }
  };

  // This is the same as above, but instead of updating React state, it adds the
  // text to the Figma canvas.
  const onStreamToCanvas = async () => {
    const layers = await getTextForSelection();

    if (!layers.length) {
      figmaAPI.run(async (figma) => {
        figma.notify(
          "Please select a layer with text in it to generate a poem.",
          { error: true },
        );
      });
      return;
    }

    const reader = await streamAIResponse({
      layers,
    });
    

    let text = "";
    let nodeID: string | null = null;
    const textPosition = await getTextOffset();

    const createOrUpdateTextNode = async () => {
      // figmaAPI.run is a helper that lets us run code in the figma plugin sandbox directly
      // from the iframe without having to post messages back and forth. For more info,
      // see /lib/figmaAPI.ts
      //
      // It is important to note that any variables that this function closes over must be
      // specified in the second argument to figmaAPI.run. This is because the code is actually
      // run in the figma plugin sandbox, not in the iframe.
      nodeID = await figmaAPI.run(
        async (figma, { nodeID, text, textPosition }) => {
          let node = figma.getNodeById(nodeID ?? "");

          // If the node doesn't exist, create it and position it to the right of the selection.
          if (!node) {
            node = figma.createText();
            node.x = textPosition?.x ?? 0;
            node.y = textPosition?.y ?? 0;
          }

          if (node.type !== "TEXT") {
            return "";
          }

          const oldHeight = node.height;

          await figma.loadFontAsync({ family: "Inter", style: "Medium" });
          node.fontName = { family: "Inter", style: "Medium" };

          node.characters = text;

          // Scroll and zoom to the node if it's height changed (ex we've added a new line).
          // We only do this when the height changes to reduce flickering.
          if (oldHeight !== node.height) {
            figma.viewport.scrollAndZoomIntoView([node]);
          }

          return node.id;
        },
        { nodeID, text, textPosition },
      );
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      text += value;
      await createOrUpdateTextNode();
    }
  };


  const [icons, setIcons] = useState<Array<IconType>>([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(()=>{
    async function getIcons() {
      try {
        let iconsList = await getSelection();
        setIcons(iconsList);
      } catch (error) {
        console.error("Failed to get icons:", error);
      }
    }
    getIcons();
  }, [])

  return (
    <div className="flex flex-col items-center min-h-screen">
      {false && <FRE />}
      <div
        style={{
          display: "flex",
          padding: "0 16px",
          marginTop: 12,
          alignItems: "center",
        }}
      >
        <Tab
          onClick={() => {}}
          active={true} //fix this
          label="Generate"
        ></Tab>
      </div>
      <Checkbox
        className=""
        label={`Selected (${icons.length})`}
        onChange={function _(){}}
        type="checkbox"
      />
      <ul>
        {icons.map((icon, idx) => (
          <li key={idx} className="flex flex-row">
            <div className="flex flex-row gap-1">
              <SvgImage svgString={icon.image} alt={icon.name} />
              <p>{icon.name}</p>
            </div>
          </li>
        ))}
      </ul>
      {/* <div className="flex flex-row gap-2">
        <button
          onClick={onStreamToIFrame}
          className="mb-5 p-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Generate Poem in iframe
        </button>
        <button
          onClick={onStreamToCanvas}
          className="mb-5 p-2 px-4 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Generate Poem on Canvas
        </button>
      </div>
      {completion && (
        <div className="border border-gray-600 rounded p-5 bg-gray-800 shadow-lg m-2 text-gray-200">
          <pre className="whitespace-pre-wrap">
            <p className="text-md">{completion}</p>
          </pre>
        </div>
      )}
      <div>
      </div> */}

      
      {/* <Icon
        className="icon--spin icon--spinner"
        color="black8"
        name="spinner"
      />    */}
      <Button
      >
        Generate
      </Button>
      <Button isSecondary={true}>
        Cancel
      </Button>
    </div>
  );
}
