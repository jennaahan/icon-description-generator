import React from 'react'
import { IconType } from '@/lib/customTypes';
import SvgImage from './SVGImage';
import { Text, Icon, Textarea } from 'react-figma-plugin-ds';

interface EditProps {
    icons: IconType[],
    selectedIcons: String[],
    // setSelectedIcons: (icons: String[]) => void;
}

function Edit({icons, selectedIcons} : EditProps) {
  return (
    <ul className='p-4 flex flex-col gap-2 mb-16'>
        {icons.map((icon, idx)=>(
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
                            onClick={() => console.log('')}
                        />
                        <Icon
                            className=""
                            color="black8"
                            name="swap"
                            onClick={() => console.log('')}
                        />
                    </div>
                </div>
                <Textarea
                    placeholder={"Description"}
                    rows={4}
                    defaultValue={icon.AIDescription}
                />
            </li>
        ))}
    </ul>
  )
}

export default Edit