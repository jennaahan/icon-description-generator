import { figmaAPI } from "@/lib/figmaAPI";
import { IconType } from "./customTypes";

export async function getSelection() {
  return await figmaAPI.run(async (figma) => {
    // current user selection
    const { selection } = figma.currentPage;
    
    // array to store icon objects
    let icons : IconType[] = []

    // helper function to get icon image
    async function getIconImage(node: SceneNode){
        const img = await node.exportAsync({ format: 'SVG_STRING' })
        return img
      }
    
    // helper function to traverse nodes, add icons to array
    async function traverse(node: SceneNode){
        if (!node.visible) return

        // if it's a component or component set, add icon to array
        if (node.type === "COMPONENT_SET" || node.type === "COMPONENT"){
            const previewIcon = node.type === "COMPONENT" ? node : node.children[0]
            let img = await getIconImage(previewIcon)
          
            let nodeIcon: IconType = {
                name: node.name,
                image: img,
                description: node.description
            }
            icons.push(nodeIcon)
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
    const traversePromises = selection.map((node) => traverse(node));
    await Promise.all(traversePromises);
    
    console.log(icons)
    return icons
  });
}