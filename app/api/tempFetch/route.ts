// app/api/fetchResponse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(req: NextRequest) {
  try {
    console.log("calling temp fetch")
    const iconsJSON = await req.json();

    console.log("Fetching AI response for the following icons:")
    console.log(iconsJSON)

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const prompt = 
    `Imagine you are a UX designer updating a Figma icon library. Your task is to generate descriptions to the icon provided in Icons JSON to improve its searchability and ensure they are used correctly. Given the following icon, add an AI-generated description for the icon in the specified format. 
    
    Return only the AI description without any additional text. The output description will immediately be assigned to icon without additional formatting

    Icons JSON:
    ${JSON.stringify(iconsJSON)}

    Format for AI description:
    Keyword: [icon description];
    Metaphor: [related metaphors];
    [usage description]

    Expected description format:
    "Keyword: description1;\nMetaphor: [metaphors];\n\n[usage description]"
    
    Considerations for AIDescription:
    - Keyword must be followed by one line break, metaphor must be followed by one line break, and usage description must be followed by two line breaks
    - AIDescription should match format for AIDescription and look similar to given examples
    - Keyword should be the exact description provided for the icon in the Icons JSON
    - Metaphor should include comma separated metaphors for the given icon
    - Metaphor should be strictly based on the provided icon name and description
    - Metaphor should not include overly complex words. Please add words people would realistically search when looking for icons
    - When generating metaphors, consider what metadata other icon libraries may assign to the given icon
    - Usage description should start with either "Used to" or "Used for:
    - Usage description should be concise (3-8 words)
    - Usage description should be strictly based on the provided icon name and description. Avoid making assumptions or adding unnecessary details
    
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
