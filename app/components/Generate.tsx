import React, { useState } from 'react'
import { Text, Button, Checkbox, Select, Textarea } from "react-figma-plugin-ds"
import { IconType } from '@/lib/customTypes'
import SvgImage from './SVGImage'

interface GenerateProps {
  icons: IconType[],
  selectedIcons: String[],
  setSelectedIcons: (icons: String[]) => void
}

function Generate({icons, selectedIcons, setSelectedIcons} : GenerateProps) {

  const [showDescription, setShowDescription] = useState(false);
  const [selectedType, setSelectedType] = useState("all")

  function toggleIcon(icon: string) {
    var index = selectedIcons.indexOf(icon)
    var newSelectedIcons = [...selectedIcons]
    if (index > -1) {
      newSelectedIcons.splice(index, 1)
    }
    else {
      newSelectedIcons.push(icon)
    }
    setSelectedIcons(newSelectedIcons)
  }

  function typeFilter(icon: IconType) : boolean{
    // return true if the description is missing
    if (selectedType === "missing"){
      return !icon.description
    }
    // return true if the description is missing or in incorrect format
    else if (selectedType === "misformatted"){
      // strict regex to check if the description includes keyword, metaphor, and usage description
      const strictRegex = /^Keyword:\s.+;\nMetaphor:\s(?:\w+(?:,\s)?)+;\n\nUsed.+\.$/
      // lenient regex to account for missing usage descriptions, any additional fields/descriptions
      const regex = /^Keyword:\s.+;\nMetaphor:\s(?:.+(?:,\s)?)+;[\s\S.]*$/
      
      if (!icon.description || !regex.test(icon.description)){
        console.log("NOT PASSING")
        console.log(icon.name)
        console.log(icon.description || "")
      }

      return !icon.description || !regex.test(icon.description)
    }
    return true
  }

  return (
    <div className="mt-4 mb-16 min-h-max">
      <Text className="mx-4 mb-4">{`Selected ${selectedIcons.length} of ${icons.length} icons`}</Text>
      <Checkbox
        label='Show icon descriptions'
        defaultValue={false}
        onChange={() => setShowDescription(!showDescription)}
      />
      <Select
        className='my-4'
        defaultValue="all"
        onChange={(option) => setSelectedType(option.value)}
        onExpand={function _(){}}
        options={[
          {
            label: 'All icons',
            title: 'All icons',
            value: 'all'
          },
          {
            label: 'Icons without descriptions',
            title: 'Icons without descriptions',
            value: "missing"
          },
          {
            label: 'Icons with misformatted descriptions',
            title: 'Icons without descriptions',
            value: "misformatted"
          }
        ]}
        placeholder="Select icon type"
      />
      <ul className="flex flex-col gap-3">
        {icons.filter(typeFilter).map((icon, idx) => (
          <li 
            onClick={() => toggleIcon(icon.name)}
            key={idx} 
            className="flex flex-col justify-start gap-4 items-left ml-1.5"
          >
            <Checkbox
              key={selectedIcons.indexOf(icon.name)} //used to force reload when selected icons updates
              defaultValue={selectedIcons.indexOf(icon.name) > -1}
              type="checkbox"
            />
            <div className="flex flex-row gap-2 items-center">
              <div className="p-2 bg-gray-100 rounded-sm">
                <SvgImage src={icon.image} alt={icon.name} width={16} height={16} />
              </div>
              <Text>{icon.name}</Text>
            </div>
               {showDescription &&
                  <pre>{icon.description}</pre>     
              }
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Generate