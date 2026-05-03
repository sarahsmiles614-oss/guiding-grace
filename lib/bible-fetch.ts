import { BibleChapter } from "./bible-plan";

export interface FetchedVerse {
  verseNum: number;
  text: string;
  reference: string;
  bookName: string;
  chapter: number;
  chapterLabel: string;
}

// Both KJV and WEB are public domain — fetched free via bible-api.com.
export async function fetchChapterVerses(
  ch: BibleChapter,
  translationId: string,
): Promise<FetchedVerse[]> {
  const translation = translationId === "web" ? "web" : "kjv";
  const res = await fetch(`https://bible-api.com/${ch.bookAbbr}+${ch.chapter}?translation=${translation}`);
  if (!res.ok) throw new Error("Could not load scripture. Check your connection and try again.");
  const data = await res.json();
  return (data.verses as any[]).map(v => ({
    verseNum: v.verse,
    text: v.text.trim(),
    reference: `${ch.bookName} ${ch.chapter}:${v.verse}`,
    bookName: ch.bookName,
    chapter: ch.chapter,
    chapterLabel: `${ch.bookName} ${ch.chapter}`,
  }));
}
