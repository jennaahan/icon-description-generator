import React from 'react'
import { IconType } from '@/lib/customTypes'
import SvgImage from './SVGImage'
import { Text, Icon, Textarea } from 'react-figma-plugin-ds'

interface EditProps {
  icons: IconType[],
  selectedIcons: String[],
  setIcons: (icons: IconType[]) => void
}

function Edit({icons, selectedIcons, setIcons} : EditProps) {
  function editDescription(iconName: string, value: string){
    let editedIcons = icons.map((icon) => icon.name == iconName ? {...icon, AIDescription: value} : icon)
    setIcons(editedIcons)
  }

  async function regenerateDescription(iconName: string, description: string){
    let iconJSON = JSON.stringify({iconName, description})

    try {
      const response = await fetch('/api/generateSingle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: iconJSON,
      })
      
      // retrieve and utilize new description
      const { data } = await response.json()
      editDescription(iconName, data.message.content)
    } catch (error) {
      console.error('Failed to regenerate description:', error)
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
                    onClick={() => regenerateDescription(icon.name, icon.description || "")}
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
        ))
      }
    </ul>
  )
}

export default Edit