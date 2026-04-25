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
          content: `[${seed}] Generate a Bible scripture promise for the category "${cat}".

${nudge} Use the NIV translation. DO NOT use: ${avoidList}.

Respond with ONLY this JSON, no extra text:
{"category":"${cat}","scripture":"verse text here","reference":"Book Chapter:Verse","reflection":"2-3 sentences here"}`,
        },
        // Prime Claude to start the JSON directly
        {
          role: "assistant",
          content: "{",
        },
      ],
    }),
  });

  const data = await response.json();
  const partial = data.content?.[0]?.text?.trim();
  if (!partial) return NextResponse.json({ error: "No response from Claude" }, { status: 500 });

  // Claude started after our "{" — prepend it back
  const text = "{" + partial;

  // Extract JSON even if there's surrounding text
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return NextResponse.json({ error: "Could not extract JSON", raw: text }, { status: 500 });

  try {
    const parsed = JSON.parse(match[0]);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to parse JSON", raw: text }, { status: 500 });
  }
}
