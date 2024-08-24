// api endpoint to generate descriptions for all selected icons
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
  try {
    console.log("Generating AI descriptions for all icons");
    const iconsJSON = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const prompt = `Imagine you are a UX designer updating a Figma icon library. Your task is to add an AIDescription field to each icons provided in Icons JSON to improve their searchability and ensure they are used correctly.
    
    Icons JSON:
    ${JSON.stringify(iconsJSON)}

    Format for AI description:
    [icon description];
    Metaphor: [related metaphors];
    [usage description]

    Expected output JSON format:
    [
      {
        "name": "icon1",
        "AIDescription": "[description1];\nMetaphor: [metaphors];\n\n[usage description]"
      },
      {
        "name": "icon2",
        "AIDescription": "[description2];\nMetaphor: [metaphors];\n\n[usage description]"
      }
    ]

    Considerations for output JSON:
    - Do not alter the name of the icon

    Formatting:
    - In AIDescription, description should be followed by a semicolon and one line break and metaphor should be followed by a semicolon and two line breaks
    - Return only the JSON string without any additional text or formatting. Parsing the output message shouldn't cause any SyntaxErrors
  
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

    Again, make sure parsing the output response with JSON.parse() does not cause any errors. Do not wrap the output JSON with additional text or symbols. Make sure the newline characters are escaped correctly. Make sure all keys and values are wrapped with double quotes.
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
