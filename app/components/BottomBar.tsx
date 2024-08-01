import React from 'react'
import { Text, Button } from "react-figma-plugin-ds"
import { figmaAPI } from '@/lib/figmaAPI'
import { closePlugin } from '../utils/utils'

interface BottomBarProps {
  description: string,
  buttonText: string,
  onClick: () => void
}

export default function BottomBar({description, buttonText, onClick} : BottomBarProps) {

  
  return (
    <div className="w-full p-4 fixed bottom-0 flex flex-row items-center justify-between border border-t-gray-300 bg-white z-50">
      <Text size="small">{description}</Text>
      <div className="flex flex-row items-center gap-2">
        <Button 
          isSecondary={true}
          onClick={closePlugin}
        >
          Cancel
        </Button>
        <Button
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}