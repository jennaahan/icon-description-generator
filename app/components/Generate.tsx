import React, { useEffect, useState } from 'react'
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

      return !icon.description || !regex.test(icon.description)
    }
    return true
  }

  useEffect(()=>(
    setSelectedIcons(icons.filter(typeFilter).map(icon => icon.name))
  ), [selectedType])

  return (
    <section className="mb-20">
      <section className='sticky top-0 z-10 bg-white border border-b-gray-300'>
        <Select
          className='my-2 mx-2'
          defaultValue="all"
          onChange={(option) => setSelectedType(option.value)}
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
        <Text weight='medium' className="mx-4 mb-2">
          {`Selected ${selectedIcons.length} of ${icons.filter(typeFilter).length} ${icons.filter(typeFilter).length > 1 ? "icons" : "icon"}`}
        </Text>
        <Checkbox
          className='mx-2 mb-2'
          label='Show descriptions'
          defaultValue={false}
          type='switch'
          onChange={(value) => setShowDescription(value)}
        />
      </section>
      <ul className="flex flex-col gap-3 w-full mt-4">
        {icons.filter(typeFilter).map((icon, idx) => (
          <li 
            className="flex flex-row justify-start gap-4 items-left ml-2 mr-4"
            onClick={() => toggleIcon(icon.name)}
            key={idx} 
          >
            <Checkbox
              key={selectedIcons.indexOf(icon.name)} //used to force reload when selected icons updates
              defaultValue={selectedIcons.indexOf(icon.name) > -1}
              type="checkbox"
            />
            <div className='flex flex-col gap-2 flex-grow'>
              <div className='flex flex-row gap-2 items-center'>
                <div className="p-2 bg-gray-100 rounded-sm">
                  <SvgImage src={icon.image} alt={icon.name} width={16} height={16} />
                </div>
                <Text>{icon.name}</Text>
              </div>
              {showDescription && 
                <Textarea
                  placeholder={"No description provided"}
                  rows={4}
                  defaultValue={icon.description}
                  isDisabled={true}
                />
              }
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Generate