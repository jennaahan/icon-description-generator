import React from "react"
import { IconType } from "@/lib/customType"
import SvgImage from "./SVGImage"
import { Text, Icon, Textarea } from "react-figma-plugin-ds"
import Tooltip from "./Tooltip"
import { showToast } from "../utils/utils"

interface EditProps {
  icons: IconType[],
  selectedIcons: String[],
  setIcons: (icons: IconType[]) => void
}

function Edit({icons, selectedIcons, setIcons} : EditProps) {

  // edit description of icon
  function editDescription(iconName: string, value: string){
    const editedIcons = icons.map((icon) => icon.name == iconName ? {...icon, AIDescription: value} : icon)
    setIcons(editedIcons)
  }

  // retrieve and utilize new description
  async function regenerateDescription(iconName: string, description: string){
    const iconJSON = JSON.stringify({iconName, description})
    showToast("Regenerating description")

    try {
      const response = await fetch("/api/generateSingle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: iconJSON,
      })
      const { data } = await response.json()
      editDescription(iconName, data.message.content)
    } catch (error) {
      console.error("Failed to regenerate description:", error)
    }
  }

  return (
    <ul className="flex flex-col gap-3 p-4 mb-16">
        {icons.filter(icon => selectedIcons.indexOf(icon.name) != -1).map((icon, idx)=>(
          <li key={idx} className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row gap-2 items-center">
                <div className="p-2 bg-grey rounded-sm">
                  <SvgImage src={icon.image} alt={icon.name} width={16} height={16} />
                </div>
                <Text>{icon.name}</Text>
              </div>
              <div className="flex flex-row items-center">
                <div className="tooltip-wrapper relative">
                  <Icon
                      className=""
                      color="black8"
                      name="recent"
                      onClick={() => editDescription(icon.name, icon.description || "")}
                  />
                  <Tooltip
                    text="Reset"
                  />
                </div>
                <div className="tooltip-wrapper relative">
                  <Icon
                      className=""
                      color="black8"
                      name="swap"
                      onClick={() => regenerateDescription(icon.name, icon.description || "")}
                  />
                  <Tooltip
                    text="Regenerate"
                  />
                </div>
              </div>
            </div>
            <Textarea
                key={icon.AIDescription}
                placeholder={"Description"}
                rows={4}
                defaultValue={icon.AIDescription}
                onChange={(value)=>{editDescription(icon.name, value)}}
            />
          </li>
        ))
      }
    </ul>
  )
}

export default Edit