// app/api/fetchResponse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(req: NextRequest) {
  try {
    const iconsJSON = await req.json();

    console.log("Fetching AI response for the following icons:")
    console.log(iconsJSON)

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const prompt = 
    `Imagine you are a UX designer updating a Figma icon library. Your task is to add descriptions to icons provided in Icons JSON to improve their searchability and ensure they are used correctly. Given the following JSON array of icons, add an AI-generated description for each icon in the specified format. 
    
    Return only the JSON array without any additional text. When the output message is parsed, it shouldn't cause any SyntaxErrors:

    Icons JSON:
    ${JSON.stringify(iconsJSON)}

    Format for AI description:
    Keyword: [icon description];
    Metaphor: [related metaphors];
    [usage description]

    Expected JSON format:
    [
      {
        "name": "icon1",
        "AIDescription": "Keyword: description1;\nMetaphor: [metaphors];\n\n[usage description]"
      },
      {
        "name": "icon2",
        "AIDescription": "Keyword: description2;\nMetaphor: [metaphors];\n\n[usage description]"
      }
    ]

    Considerations for output JSON:
    - Do not alter the name of the icon
    - Running JSON.parse() on the given JSON should not cause a SyntaxError
    - Output should match the expected JSON format
    
    Considerations for AIDescription:
    - Keyword should be followed by one line break, metaphor should be followed by one line break, and usage description should be followed by two line breaks
    - AIDescription should match format for AIDescription and look similar to given examples
    - Keyword should be the exact description provided for the icon in the Icons JSON
    - Metaphor should include comma separated metaphors for the given icon
    - Metaphor should be strictly based on the provided icon name and description
    - Metaphor should not include overly complex words. Please add words people would realistically search when looking for icons
    - When generating metaphors, consider what metadata other icon libraries may assign to the given icon
    - Usage description should start with either "Used to" or "Used for:
    - Usage description should be concise (3-8 words)
    - Usage description should be very strictly based on the provided icon name and description. Avoid making assumptions or adding unnecessary details
    
     ---

    Here are a few examples of what the format and content of AIDescriptions may look like for reference:
    
    Calendar Settings icon:
    Keyword: fluent-icon, outlook, teams;
    Metaphor: time, date, planning;
    Used in calendar scenarios.

    Accessibility icon:
    Keyword: fluent-icon;
    Metaphor: person, inclusive;
    Used for accessibility checker and topics.

    Folder Person icon:
    Keyword: fluent-icon;
    Metaphor: analog, collection, subject rights requests;
    Used to represent collections of files.

    ---

    Again, MAKE 100% SURE that parsing the output message with JSON.parse does not cause any errors, including syntax errors
    
    `;


    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4o-mini",
    });

    return NextResponse.json({ data: completion.choices[0] });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
