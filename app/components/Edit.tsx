import React from 'react'
import { IconType } from '@/lib/customTypes';
import SvgImage from './SVGImage';
import { Text, Icon, Textarea } from 'react-figma-plugin-ds';

interface EditProps {
    icons: IconType[],
    selectedIcons: String[],
    setIcons: (icons: IconType[]) => void;
}

function Edit({icons, selectedIcons, setIcons} : EditProps) {

    function editDescription(iconName: string, value: string){
        console.log(value)
        let newIcons = icons.map((icon) => icon.name == iconName ? {...icon, AIDescription: value} : icon)
        setIcons(newIcons)
        console.log(newIcons)
    }

    async function fetchAIResponse(iconName: string, description: string){
        console.log("fetching for" + iconName)
        let iconsJSON = {iconName, description}
    
        try {
          const response = await fetch('/api/tempFetch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(iconsJSON),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          // retrieve and save AI response
          console.log("Successfully fetched response")
          const { data } = await response.json();
          console.log(data.message.content)
          editDescription(iconName, data.message.content)
    
        } catch (error) {
          console.error('Error:', (error as Error).message);
        }
      }

  return (
    <ul className='p-4 flex flex-col gap-2 mb-16'>
        {icons.filter(icon => selectedIcons.indexOf(icon.name) != -1).map((icon, idx)=>(
            <li key={idx}>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row gap-2 items-center'>
                        <SvgImage
                            src={icon.image}
                            alt={icon.name}
                            width={20}
                            height={20}
                        />
                        <Text>{icon.name}</Text>
                    </div>
                    <div className='flex flex-row items-center'>
                        <Icon
                            className=""
                            color="black8"
                            name="recent"
                            onClick={() => editDescription(icon.name, icon.description || "")}
                        />
                        <Icon
                            className=""
                            color="black8"
                            name="swap"
                            onClick={() => fetchAIResponse(icon.name, icon.description || "")}
                        />
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
        ))}
    </ul>
  )
}

export default Edit