import React from 'react'
import { Text, Checkbox } from "react-figma-plugin-ds";
import { IconType } from '@/lib/customTypes';
import SvgImage from './SVGImage';

interface GenerateProps {
  icons: IconType[],
  selectedIcons: String[],
  setSelectedIcons: (icons: String[]) => void;
}

function Generate({icons, selectedIcons, setSelectedIcons} : GenerateProps) {

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

  /** build custom checkbox that takes in value, not default value */
  // alternative use before to add icon div
  return (
    <div className="mt-4 min-h-max">
        <Text className="mx-4 mb-4">{`Selected ${selectedIcons.length} of ${icons.length} icons`}</Text>
        <ul className="flex flex-col gap-3">
          {icons.map((icon, idx) => (
            <li 
              // onClick={() => toggleIcon(icon.name)}
              key={idx} 
              className="flex flex-row gap-4 items-center ml-1.5"
              >
              <Checkbox
                onChange={() => toggleIcon(icon.name)}
                defaultValue={selectedIcons.indexOf(icon.name) > -1}
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
      </div>
  )
}

export default Generate