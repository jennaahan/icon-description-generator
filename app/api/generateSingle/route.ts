// api endpoint to generate description for a single icon
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
  try {
    console.log("Generating AI description for a single icon");
    const iconJSON = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const prompt = `Imagine you are a UX designer updating a Figma icon library. Your task is to come up with an AIDescription for the icon provided in Icon JSON to improve its searchability and ensure it is used correctly.
    
    Icon JSON:
    ${JSON.stringify(iconJSON)}

    Format for AI description:
    [icon description];
    Metaphor: [related metaphors];
    [usage description]

    Formatting:
    - In AIDescription, description should be followed by a semicolon and one line break and metaphor should be followed by a semicolon and two line breaks
    - Return only the AI description without any additional text or formatting. The description in the output message will be directly assigned to the icon

    Considerations for AIDescription:
    - Icon JSON includes icons for Microsoft Fabric, which means they are often related to data and analytics
    - [description] should be the exact description provided for the icon in the Icons JSON. DO NOT CHANGE IT IN ANY WAY, INCLUDING CHANGING CAPITALIZATION.
    - if no description is provided, [description] should just be the icon name
    - Metaphor should include comma separated metaphors for the given icon
    - Metaphor should be strictly based on the provided icon name and description
    - Metaphor should not be words included in the icon name or description
    - Metaphor should not include overly complex words. Please add words people would realistically search when looking for icons
    - When generating metaphor, consider what metaphor or metadata other icon libraries may assign to the given icon
    - Usage description should start with either "Used to" or "Used for"
    - Usage description should be concise (3-8 words)
    - Usage description should be very strictly based on the provided icon name and description. Avoid making assumptions or adding unnecessary details. If possible, just repeat the icon description in verb form
    - AGAIN, be as conservative as possible when generating descriptions and metaphors, relying heavily on the given name and description

    Here are examples of AIDescription for reference:
    
    Accessibility:
    "fluent-icon;
    Metaphor: person, inclusive;

    Used for accessibility checker and topics."

    Arrow Circle Down:
    "fluent-icon;
    Metaphor: point, direction, vertical, circle;

    Used for directional indicators."
    
    Arrow Sprint:
    "fluent-icon;
    Metaphor: time, loop, timing, process;

    Used to represent a sprint when talking about timing or process."

    Make sure to come up with a description that is different from the previous given description.
    `;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4o-mini",
    });

    return NextResponse.json({ data: completion.choices[0] });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
