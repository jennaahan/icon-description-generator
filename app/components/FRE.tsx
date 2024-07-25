import React from 'react'
import { Button, Title } from 'react-figma-plugin-ds'
import Image from 'next/image'
import iconSelection from '../assets/icon-selection.svg'

function FRE() {
  return (
    <div className='flex flex-col justify-center text-center'>
        <Title
            className="max-w-xs"
            level="h1"
            size="small"
            weight="bold"
            >
            Select icons and run to generate descriptions
        </Title>
        <Image
        src={iconSelection}
        alt="Icon selection"
        width={248}
        height={152}
        />
        <Button>
            Get started
        </Button>
    </div>
  )
}

export default FRE