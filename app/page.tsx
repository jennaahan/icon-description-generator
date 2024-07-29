"use client";

import { figmaAPI } from "@/lib/figmaAPI";
import { useEffect, useState } from "react";
import { getSelection } from "@/lib/getSelection";
import { IconType } from "@/lib/customTypes";
import Image from "next/image";
import Edit from "./components/Edit";
import BottomBar from "./components/BottomBar";
import { updateDescription } from "@/lib/updateDescription";
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
       * 
       * 
       * TODO maybe update icon type to include component key for easier update
       */

import { Title, Icon, Text} from "react-figma-plugin-ds";
import "react-figma-plugin-ds/figma-plugin-ds.css";
import iconSelection from './assets/icon-selection.svg'

import FRE from "./components/FRE";
import Generate from "./components/Generate";
import Export from "./components/Export";

export default function Plugin() {
  const [icons, setIcons] = useState<Array<IconType>>([]);
  const [loading, setLoading] = useState(false);
  const [AIResponse, setAIResponse] = useState("")
  const [selectedIcons, setSelectedIcons] = useState<Array<String>>([]);

  useEffect(()=>{
    //get all icons in selected frame
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

  //generates JSON string of icons such that only selected icons are included with fields name and description
  function generateIconsJSON(){
    const filteredIcons = icons
    .filter(icon => selectedIcons.includes(icon.name))
    .map(({ name, description }) => ({ name, ...(description && { description }) }));
    return JSON.stringify(filteredIcons)
  }

  async function fetchAIResponse(){
    setLoading(true)
    let iconsJSON = generateIconsJSON();

    try {
      const response = await fetch('/api/fetchResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: iconsJSON,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // retrieve and save AI response
      console.log("Successfully fetched response")
      const { data } = await response.json();
      setAIResponse(data.message.content)

    } catch (error) {
      console.error('Error:', (error as Error).message);
    } finally {
      setLoading(false);
      setSelectedTab("Export")
    }
  }

  useEffect(()=>{
    mergeArrays()
  }, [AIResponse])

  function mergeArrays() {
    //TODO make this into a more general function to just get the icon object by name
    console.log
    function getAIDescription(iconName : String) {
      let AIObj = JSON.parse(AIResponse)
      let icon = AIObj.find((icon : IconType) => icon.name === iconName);
      return icon ? icon.AIDescription : '';
    }

    let mergedArray = icons.map(icon => ({
      ...icon,
      AIDescription: getAIDescription(icon.name)
    }));
    setIcons(mergedArray)
  }

  const handleDownload = () => {
    const blob = new Blob([AIResponse], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'icon-metadata.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = ["Generate", "Edit", "Export"]
  const [selectedTab, setSelectedTab] = useState("Generate")

  function handleUpdate(){
    updateDescription(icons);
  }
  
  return (
    <div className="flex flex-col h-screen">
      {false && <FRE />}
      <ul className="sticky top-0 z-10 bg-white flex flex-row gap-4 px-4 py-3 border border-b-gray-300">
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
      {loading && 
        <div style={{ minHeight: 'calc(100vh - 160px)' }} className="flex justify-center items-center overflow-hidden">
          <Icon
              className="icon--spin icon--spinner"
              color="black8"
              name="spinner"
          />  
        </div>
      } 
      {!loading && selectedTab === "Generate" && 
        <div>
          <Generate
            icons={icons}
            selectedIcons={selectedIcons}
            setSelectedIcons={setSelectedIcons}
          />
          <BottomBar
            description="Generate descriptions"
            buttonText="Generate"
            onClick={fetchAIResponse}
          />
        </div>
      }
      { selectedTab === "Edit" &&
        <div>
          <Edit
            icons={icons}
            selectedIcons={selectedIcons}
            setIcons={setIcons}
          />
          <BottomBar
            description="Update descriptions"
            buttonText="Update"
            onClick={handleUpdate}
          />
        </div>
      }
      { selectedTab === "Export" && 
      <div>
        <Export
          AIResponse={AIResponse}
        />
        <BottomBar
          description="Download JSON"
          buttonText="Download"
          onClick={handleDownload}
        />
        </div>
      }
    </div>
  );
}
