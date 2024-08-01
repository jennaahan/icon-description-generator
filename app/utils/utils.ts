import { figmaAPI } from "@/lib/figmaAPI"

export async function showToast(message: string){
  await figmaAPI.run(
    (figma, { message }) => {
      return figma.notify(message)
    },
    // pass variable as parameter
    { message },
  );
}

export async function closePlugin(){
  await figmaAPI.run(
    (figma) => {
    figma.closePlugin()
  })
}