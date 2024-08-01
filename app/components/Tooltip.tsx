import React from "react"
import { Text } from "react-figma-plugin-ds"

interface TooltipProp {
    text: string
}

function Tooltip({text} : TooltipProp) {
  return (
    <div className={`tooltip bg-hud absolute right-0 top-10 z-10 text-white px-2 h-7 flex items-center rounded-sm whitespace-nowrap invisible`}>
        <Text>{text}</Text>
    </div>
  )
}

export default Tooltip