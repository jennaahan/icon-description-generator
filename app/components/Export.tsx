import React from 'react'
import { Icon, Text } from 'react-figma-plugin-ds'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { figmaAPI } from '@/lib/figmaAPI'

interface ExportProps {
    AIResponse: string
}

function Export({AIResponse} : ExportProps) {
  async function copyConfirmation(){
    figmaAPI.run(async (figma) => {
      figma.notify("Copied to clipboard")
    })
  }

  return (
    <div className='mx-4 mt-4 mb-20 bg-gray-100 rounded-sm'>
      <div className='px-3 py-1 flex flex-row items-center justify-between border border-b-gray-400'>
        <Text>JSON</Text>
        <CopyToClipboard text={AIResponse} onCopy={copyConfirmation}>
          <Icon name="draft" color="black3" />
        </CopyToClipboard>
      </div >
      <pre className='p-4 overflow-x-scroll'>{AIResponse}</pre>
    </div>
  )
}

export default Export