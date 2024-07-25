import React from 'react'
import { Checkbox } from 'react-figma-plugin-ds'

interface Icon {
  name: string,
  svg: string,
  description?: string
}


function Generate({icons} : {icons: [Icon]}) {
  return (
    <div>
      <ul>
        {icons.map((icon) => (
          <li>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Generate