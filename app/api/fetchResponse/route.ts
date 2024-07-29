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
    `Imagine you are a UX designer working on a Figma design system. Your task is to add metaphors to icons provided in Icons JSON to improve their searchability and ensure they are used correctly. Given the following JSON array of icons, add an AI-generated description for each icon in the specified format. Return only the JSON array without any additional text.

    Icons JSON:
    ${JSON.stringify(iconsJSON)}

    Format for AI description:
    Keyword: [icon name];
    Metaphor: [related metaphors];
    [description about usage]

    Expected JSON format:
    [
      {
        "name": "icon1",
        "description": "description1",
        "AIDescription": "Keyword: icon1;\nMetaphor: [metaphors];\n\n[description about usage]"
      },
      {
        "name": "icon2",
        "description": "description2",
        "AIDescription": "Keyword: icon2;\nMetaphor: [metaphors];\n\n[description about usage]"
      }
    ]
    
    When generating the AIDescription, base it on the provided icon description to accurately reflect the icon. Avoid making assumptions or adding unnecessary details.
    
    Do not alter the name or description fields. Make the usage description concise (3-8 words).

    Here are a few examples of what format the AIDescriptions should be in:
    
    Calendar Settings icon:
    Keyword: fluent-icon, outlook, teams;
    Metaphor: time, date, planning;

    Used in calendar scenarios.


    Accessibility icon:
    Keyword: fluent-icon;
    Metaphor: person, inclusive;

    Used for accessibility checker and topics.
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
