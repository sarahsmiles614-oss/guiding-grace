import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { category } = await req.json();

  const cat = category && category !== "All" ? category : "Faith";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Generate a Bible scripture promise for the category "${cat}" for a Christian faith app called Guiding Grace.

Choose a verse that is meaningful, comforting, and directly relevant to "${cat}". Use the NIV translation. Avoid the most commonly used verses (John 3:16, Philippians 4:13, Jeremiah 29:11) — bring something fresh, powerful, and lesser-known.

Return ONLY a valid JSON object with no markdown, no preamble:
{
  "category": "${cat}",
  "scripture": "The full verse text",
  "reference": "Book Chapter:Verse",
  "reflection": "2-3 warm, personal sentences applying this promise to the reader's life today."
}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return NextResponse.json({ error: "No response from Claude" }, { status: 500 });

  try {
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to parse response", raw: text }, { status: 500 });
  }
}
