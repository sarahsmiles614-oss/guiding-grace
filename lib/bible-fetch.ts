import { BibleChapter } from "./bible-plan";

export interface FetchedVerse {
  verseNum: number;
  text: string;
  reference: string;
  bookName: string;
  chapter: number;
  chapterLabel: string;
}

// ── API.Bible book ID mapping ─────────────────────────────────────────────────
const BOOK_ID: Record<string, string> = {
  "Genesis": "GEN", "Exodus": "EXO", "Leviticus": "LEV", "Numbers": "NUM",
  "Deuteronomy": "DEU", "Joshua": "JOS", "Judges": "JDG", "Ruth": "RUT",
  "1 Samuel": "1SA", "2 Samuel": "2SA", "1 Kings": "1KI", "2 Kings": "2KI",
  "1 Chronicles": "1CH", "2 Chronicles": "2CH", "Ezra": "EZR", "Nehemiah": "NEH",
  "Esther": "EST", "Job": "JOB", "Psalms": "PSA", "Proverbs": "PRO",
  "Ecclesiastes": "ECC", "Song of Solomon": "SNG", "Isaiah": "ISA",
  "Jeremiah": "JER", "Lamentations": "LAM", "Ezekiel": "EZK", "Daniel": "DAN",
  "Hosea": "HOS", "Joel": "JOL", "Amos": "AMO", "Obadiah": "OBA",
  "Jonah": "JON", "Micah": "MIC", "Nahum": "NAH", "Habakkuk": "HAB",
  "Zephaniah": "ZEP", "Haggai": "HAG", "Zechariah": "ZEC", "Malachi": "MAL",
  "Matthew": "MAT", "Mark": "MRK", "Luke": "LUK", "John": "JHN",
  "Acts": "ACT", "Romans": "ROM", "1 Corinthians": "1CO", "2 Corinthians": "2CO",
  "Galatians": "GAL", "Ephesians": "EPH", "Philippians": "PHP", "Colossians": "COL",
  "1 Thessalonians": "1TH", "2 Thessalonians": "2TH", "1 Timothy": "1TI",
  "2 Timothy": "2TI", "Titus": "TIT", "Philemon": "PHM", "Hebrews": "HEB",
  "James": "JAS", "1 Peter": "1PE", "2 Peter": "2PE", "1 John": "1JN",
  "2 John": "2JN", "3 John": "3JN", "Jude": "JUD", "Revelation": "REV",
};

// ── Parse API.Bible nested JSON content into flat verse list ──────────────────
function extractText(node: any): string {
  if (!node) return "";
  if (node.text) return node.text;
  if (Array.isArray(node.items)) return node.items.map(extractText).join("");
  return "";
}

function parseApiBibleContent(content: any[]): { verseNum: number; text: string }[] {
  const verses: { verseNum: number; text: string }[] = [];

  function walk(items: any[]) {
    for (const item of items) {
      if (item?.name === "verse") {
        const num = parseInt(item.attrs?.number ?? "0");
        const text = extractText({ items: item.items ?? [] }).trim();
        if (num > 0 && text) verses.push({ verseNum: num, text });
      } else if (Array.isArray(item?.items)) {
        walk(item.items);
      }
    }
  }

  walk(content);
  return verses;
}

// ── bible-api.com (free — KJV + WEB) ─────────────────────────────────────────
async function fetchBibleApiCom(ch: BibleChapter, translation: string): Promise<FetchedVerse[]> {
  const res = await fetch(`https://bible-api.com/${ch.bookAbbr}+${ch.chapter}?translation=${translation}`);
  if (!res.ok) throw new Error("fetch failed");
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

// ── API.Bible (licensed translations) ────────────────────────────────────────
async function fetchApiBible(ch: BibleChapter, bibleId: string, apiKey: string): Promise<FetchedVerse[]> {
  const bookId = BOOK_ID[ch.bookName];
  if (!bookId) throw new Error(`Unknown book: ${ch.bookName}`);

  const chapterId = `${bookId}.${ch.chapter}`;
  const params = new URLSearchParams({
    "content-type": "json",
    "include-notes": "false",
    "include-titles": "false",
    "include-chapter-numbers": "false",
    "include-verse-numbers": "true",
    "include-verse-spans": "false",
  });

  const res = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${chapterId}?${params}`,
    { headers: { "api-key": apiKey } }
  );
  if (!res.ok) throw new Error(`API.Bible error ${res.status}`);

  const data = await res.json();
  const parsed = parseApiBibleContent(data.data?.content ?? []);

  return parsed.map(v => ({
    verseNum: v.verseNum,
    text: v.text,
    reference: `${ch.bookName} ${ch.chapter}:${v.verseNum}`,
    bookName: ch.bookName,
    chapter: ch.chapter,
    chapterLabel: `${ch.bookName} ${ch.chapter}`,
  }));
}

// ── Main fetch function ───────────────────────────────────────────────────────
export async function fetchChapterVerses(
  ch: BibleChapter,
  translationId: string,
): Promise<FetchedVerse[]> {
  if (translationId === "kjv" || translationId === "web") {
    return fetchBibleApiCom(ch, translationId);
  }

  const apiKey = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
  if (!apiKey) throw new Error("API key not configured");

  return fetchApiBible(ch, translationId, apiKey);
}
