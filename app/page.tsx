"use client";

import { figmaAPI } from "@/lib/figmaAPI";
import { CompletionRequestBody } from "@/lib/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getSelection } from "@/lib/getSelection";
import { IconType } from "@/lib/customTypes";
import Image from "next/image";
import SvgImage from "./components/SVGImage";

/**
       * now wedit the prompt to generate response in correct format
       * also ignore icon image when prompt feeding
       * edit api to handle just one vs multiple icons (generate descriptiosn vs regenerate description)
       * use this info to update the icons state
       * code snippet highlighter
       * [
       *  { test: "description"
       *  
       *  }
       * ]
       * 
       * brackets should be black 3
       * key, whiche comes below should be pink
       * value, which comes after color should be blue
       */

import { Disclosure, Tip, Title, Checkbox, Button, Icon, SelectOption, Select } from "react-figma-plugin-ds";
import "react-figma-plugin-ds/figma-plugin-ds.css";
import iconSelection from './assets/icon-selection.svg'

import FRE from "./components/FRE";
import { Text } from "react-figma-plugin-ds";

export default function Plugin() {
  const [icons, setIcons] = useState<Array<IconType>>([]);
  const [loading, setLoading] = useState(false);
  const [AIResponse, setAIResponse] = useState("")
  const [selectedIcons, setSelectedIcons] = useState<Array<String>>([]);

  useEffect(()=>{
    async function getIcons() {
      let iconList = []
      try {
        iconList = await getSelection();
        setIcons(iconList);
        setSelectedIcons(iconList.map(icon => icon.name))
      } catch (error) {
        console.error("Failed to get icons:", error);
      }

      //todo make this not glitchy
      if (iconList.length == 0) {
        figmaAPI.run(async (figma) => {
          figma.notify(
            "Please select a layer with icons to generate descriptions.",
          );
          // figma.closePlugin()
        });
        return;
      }
    }
    getIcons();
  }, [])

  async function closePlugin(){
    figmaAPI.run(async (figma) => {
      figma.closePlugin()
    });
  }
  

  async function fetchResponse(){
    setLoading(true)

    try {
      const response = await fetch('/api/fetchResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(icons),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const { data } = await response.json();
      console.log(data)
      console.log(data.message.content)
      setAIResponse(data.message.content)

    } catch (error) {
      console.error('Error:', (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const tabs = ["Generate", "Edit", "Export"]
  const [selectedTab, setSelectedTab] = useState("Generate")

  function toggleIcon(icon: string) {
    var index = selectedIcons.indexOf(icon);
    var selectedIconsCopy = [...selectedIcons]
    if (index > -1) {
      selectedIconsCopy.splice(index, 1);
    }
    else {
      selectedIconsCopy.push(icon)
    }
    setSelectedIcons(selectedIconsCopy)
  }
  
  return (
    <div className="flex flex-col">
      {false && <FRE />}
      <ul className="flex flex-row gap-4 px-4 py-3 border border-b-gray-300">
         {tabs.map((tab, index) => (
          <li onClick={() => setSelectedTab(tab)} key={index}>
            <Text weight={selectedTab == tab ? "bold" : undefined}>{tab}</Text>
          </li>
        ))}
      </ul>
      {icons.length === 0 && 
        <div className="w-full flex flex-col text-center justify-center">
          <Title
            className="max-w-xs"
            level="h1"
            size="small"
            weight="bold"
            >
              Please select a layer with at least one icon to generate descriptions
          </Title>
          <Image
            src={iconSelection}
            alt="Icon selection"
            width={248}
            height={152}
          />
        </div>
      }
      <div className="mt-4">
        <Text className="mx-4 mb-4">{`Selected ${selectedIcons.length} of ${icons.length} icons`}</Text>
        <ul className="flex flex-col gap-3">
          {icons.map((icon, idx) => (
            <li key={idx} className="flex flex-row gap-4 items-center ml-1.5">
              <Checkbox
                defaultValue={selectedIcons.indexOf(icon.name) > -1}
                onChange={() => toggleIcon(icon.name)}
                type="checkbox"
              />
              <div className="flex flex-row gap-2 items-center">
                <div className="p-2 bg-gray-100 rounded-sm">
                  <SvgImage src={icon.image} alt={icon.name} width={16} height={16} />
                </div>
                <Text>{icon.name}</Text>
              </div>
            </li>
          ))}
        </ul>
        {loading && <Icon
          className="icon--spin icon--spinner"
          color="black8"
          name="spinner"
        />  } 
        <div className="w-full p-4 fixed bottom-0 flex flex-row items-center justify-between">
          <Text size="small">Generate icon descriptions</Text>
          <p>{AIResponse}</p>
          <div className="flex flex-row items-center gap-2">
            <Button 
              isSecondary={true}
              onClick={closePlugin}
            >
              Cancel
            </Button>
            <Button
              onClick={fetchResponse}
            >
              Generate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
