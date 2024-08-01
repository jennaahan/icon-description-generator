"use client";

import { useEffect, useState } from "react";

import { IconType } from "@/lib/customType";
import { getSelection } from "@/lib/getSelection";
import { updateDescription } from "@/lib/updateDescription";

import { Icon, Text } from "react-figma-plugin-ds";
import Generate from "./components/Generate";
import Edit from "./components/Edit";
import Export from "./components/Export";
import BottomBar from "./components/BottomBar";
import { closePlugin, showToast } from "./utils/utils";

export default function Plugin() {
  const tabs = ["Edit", "Export"];
  const [selectedTab, setSelectedTab] = useState("Generate");

  const [loading, setLoading] = useState(false);
  const [icons, setIcons] = useState<Array<IconType>>([]);
  const [selectedIcons, setSelectedIcons] = useState<Array<String>>([]);
  const [AIResponse, setAIResponse] = useState("");

  useEffect(() => {
    //get all icons in selected frame
    async function getIcons() {
      let iconList = [];
      try {
        iconList = await getSelection();
        setIcons(iconList);
        setSelectedIcons(iconList.map((icon) => icon.name));
      } catch (error) {
        console.error("Failed to get icons:", error);
      }

      if (iconList.length == 0) {
        showToast("Please select a layer with icons to generate descriptions.");
        closePlugin();
        return;
      }
    }
    getIcons();
  }, []);

  //generates JSON string of icons such that only selected icons are included with fields name and description
  function generateIconsJSON() {
    const filteredIcons = icons
      .filter((icon) => selectedIcons.includes(icon.name))
      .map(({ name, description }) => ({
        name,
        ...(description && { description }),
      }));
    return JSON.stringify(filteredIcons);
  }

  async function fetchAIResponse() {
    setLoading(true);
    let iconsJSON = generateIconsJSON();

    try {
      const response = await fetch("/api/generateAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: iconsJSON,
      });

      // retrieve and save AI response
      console.log("Successfully fetched response");
      const { data } = await response.json();
      setAIResponse(data.message.content);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    } finally {
      setLoading(false);
      setSelectedTab("Edit");
    }
  }

  function mergeArrays() {
    function getAIDescription(iconName: String) {
      let AIObj = JSON.parse(AIResponse);
      let icon = AIObj.find((icon: IconType) => icon.name === iconName);
      return icon ? icon.AIDescription : "";
    }

    let mergedArray = icons.map((icon) => ({
      ...icon,
      AIDescription: getAIDescription(icon.name),
    }));
    setIcons(mergedArray);
  }

  useEffect(() => {
    mergeArrays();
  }, [AIResponse]);

  const handleDownload = () => {
    const blob = new Blob([AIResponse], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "icon-metadata.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  function handleUpdate() {
    updateDescription(icons);
    showToast("Updated descriptions");
  }

  return (
    <div className="flex flex-col h-screen select-none">
      {selectedTab != "Generate" && (
        <ul className="sticky top-0 z-10 bg-white flex flex-row gap-4 px-4 py-3 border border-b-silver">
          {tabs.map((tab, index) => (
            <li onClick={() => setSelectedTab(tab)} key={index}>
              <Text
                className={selectedTab == tab ? "text-black8" : "text-black3"}
                weight={selectedTab == tab ? "bold" : "medium"}
              >
                {tab}
              </Text>
            </li>
          ))}
        </ul>
      )}
      {loading && (
        <div
          style={{ minHeight: "calc(100vh - 80px)" }}
          className="flex justify-center items-center overflow-hidden"
        >
          <Icon
            className="icon--spin icon--spinner"
            color="black8"
            name="spinner"
          />
        </div>
      )}
      {!loading && selectedTab === "Generate" && (
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
      )}
      {selectedTab === "Edit" && (
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
      )}
      {selectedTab === "Export" && (
        <div>
          <Export AIResponse={AIResponse} />
          <BottomBar
            description="Download JSON"
            buttonText="Download"
            onClick={handleDownload}
          />
        </div>
      )}
    </div>
  );
}
