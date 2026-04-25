import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { category, recentRefs = [] } = await req.json();

  const cat = category && category !== "All" ? category : "Faith";

  const avoidList = [
    "John 3:16", "Philippians 4:13", "Jeremiah 29:11", "Romans 8:28",
    "Isaiah 41:10", "Psalm 23:1", "Proverbs 3:5", "Matthew 11:28",
    ...recentRefs,
  ].join(", ");

  // Random nudge so identical prompts yield different results
  const nudges = [
    "Pick from the Psalms.", "Pick from the Epistles.", "Pick from the Prophets.",
    "Pick from the Gospels.", "Pick from the Old Testament wisdom books.",
    "Pick a verse from Paul's letters.", "Pick a lesser-known New Testament verse.",
    "Pick a verse from the minor prophets.", "Pick something from Acts or Revelation.",
    "Pick a verse from Genesis, Exodus, or Deuteronomy.",
  ];
  const nudge = nudges[Math.floor(Math.random() * nudges.length)];
  const seed = Math.floor(Math.random() * 100000);

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
      temperature: 1,
      messages: [
        {
          role: "user",
          content: `[${seed}] Generate a Bible scripture promise for the category "${cat}" for a Christian faith app called Guiding Grace.

${nudge} Choose a verse that is meaningful, comforting, and directly relevant to "${cat}". Use the NIV translation.

DO NOT use any of these verses: ${avoidList}.

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
