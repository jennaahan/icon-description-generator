import { figmaAPI } from "@/lib/figmaAPI"
import { IconType } from "./customType"

export async function updateDescription(icons : IconType[]) {
  return await figmaAPI.run(async (figma, icons: IconType[]) => {

    // current user selection
    const { selection } = figma.currentPage
    
    // helper function to traverse nodes
    async function traverse(node: SceneNode){
 
        if (!node.visible) return

        // if it's a component or component set, update description
        if (node.type === "COMPONENT_SET" || node.type === "COMPONENT"){
            let icon = icons.find((icon : IconType) => icon.name === node.name)
            node.description = icon?.AIDescription || ""
            return
        }
        
        //if the node has children, traverse them
        if ("children" in node) {
          if (node.type !== "INSTANCE") {
            for (const child of node.children) {
                await traverse(child)
            }
          }
        }
    }

    // wait for all traverse calls to complete for all selections
    const traversePromises = selection.map((node) => traverse(node))
    await Promise.all(traversePromises)
  }, icons)
}