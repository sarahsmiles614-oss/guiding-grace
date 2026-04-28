// 66 books of the Bible with chapter counts (KJV canon)
const BOOKS: { name: string; abbr: string; chapters: number }[] = [
  // Old Testament (39 books)
  { name: "Genesis",        abbr: "genesis",        chapters: 50 },
  { name: "Exodus",         abbr: "exodus",          chapters: 40 },
  { name: "Leviticus",      abbr: "leviticus",       chapters: 27 },
  { name: "Numbers",        abbr: "numbers",         chapters: 36 },
  { name: "Deuteronomy",    abbr: "deuteronomy",     chapters: 34 },
  { name: "Joshua",         abbr: "joshua",          chapters: 24 },
  { name: "Judges",         abbr: "judges",          chapters: 21 },
  { name: "Ruth",           abbr: "ruth",            chapters: 4  },
  { name: "1 Samuel",       abbr: "1+samuel",        chapters: 31 },
  { name: "2 Samuel",       abbr: "2+samuel",        chapters: 24 },
  { name: "1 Kings",        abbr: "1+kings",         chapters: 22 },
  { name: "2 Kings",        abbr: "2+kings",         chapters: 25 },
  { name: "1 Chronicles",   abbr: "1+chronicles",    chapters: 29 },
  { name: "2 Chronicles",   abbr: "2+chronicles",    chapters: 36 },
  { name: "Ezra",           abbr: "ezra",            chapters: 10 },
  { name: "Nehemiah",       abbr: "nehemiah",        chapters: 13 },
  { name: "Esther",         abbr: "esther",          chapters: 10 },
  { name: "Job",            abbr: "job",             chapters: 42 },
  { name: "Psalms",         abbr: "psalms",          chapters: 150 },
  { name: "Proverbs",       abbr: "proverbs",        chapters: 31 },
  { name: "Ecclesiastes",   abbr: "ecclesiastes",    chapters: 12 },
  { name: "Song of Solomon",abbr: "song+of+solomon", chapters: 8  },
  { name: "Isaiah",         abbr: "isaiah",          chapters: 66 },
  { name: "Jeremiah",       abbr: "jeremiah",        chapters: 52 },
  { name: "Lamentations",   abbr: "lamentations",    chapters: 5  },
  { name: "Ezekiel",        abbr: "ezekiel",         chapters: 48 },
  { name: "Daniel",         abbr: "daniel",          chapters: 12 },
  { name: "Hosea",          abbr: "hosea",           chapters: 14 },
  { name: "Joel",           abbr: "joel",            chapters: 3  },
  { name: "Amos",           abbr: "amos",            chapters: 9  },
  { name: "Obadiah",        abbr: "obadiah",         chapters: 1  },
  { name: "Jonah",          abbr: "jonah",           chapters: 4  },
  { name: "Micah",          abbr: "micah",           chapters: 7  },
  { name: "Nahum",          abbr: "nahum",           chapters: 3  },
  { name: "Habakkuk",       abbr: "habakkuk",        chapters: 3  },
  { name: "Zephaniah",      abbr: "zephaniah",       chapters: 3  },
  { name: "Haggai",         abbr: "haggai",          chapters: 2  },
  { name: "Zechariah",      abbr: "zechariah",       chapters: 14 },
  { name: "Malachi",        abbr: "malachi",         chapters: 4  },
  // New Testament (27 books)
  { name: "Matthew",        abbr: "matthew",         chapters: 28 },
  { name: "Mark",           abbr: "mark",            chapters: 16 },
  { name: "Luke",           abbr: "luke",            chapters: 24 },
  { name: "John",           abbr: "john",            chapters: 21 },
  { name: "Acts",           abbr: "acts",            chapters: 28 },
  { name: "Romans",         abbr: "romans",          chapters: 16 },
  { name: "1 Corinthians",  abbr: "1+corinthians",   chapters: 16 },
  { name: "2 Corinthians",  abbr: "2+corinthians",   chapters: 13 },
  { name: "Galatians",      abbr: "galatians",       chapters: 6  },
  { name: "Ephesians",      abbr: "ephesians",       chapters: 6  },
  { name: "Philippians",    abbr: "philippians",     chapters: 4  },
  { name: "Colossians",     abbr: "colossians",      chapters: 4  },
  { name: "1 Thessalonians",abbr: "1+thessalonians", chapters: 5  },
  { name: "2 Thessalonians",abbr: "2+thessalonians", chapters: 3  },
  { name: "1 Timothy",      abbr: "1+timothy",       chapters: 6  },
  { name: "2 Timothy",      abbr: "2+timothy",       chapters: 4  },
  { name: "Titus",          abbr: "titus",           chapters: 3  },
  { name: "Philemon",       abbr: "philemon",        chapters: 1  },
  { name: "Hebrews",        abbr: "hebrews",         chapters: 13 },
  { name: "James",          abbr: "james",           chapters: 5  },
  { name: "1 Peter",        abbr: "1+peter",         chapters: 5  },
  { name: "2 Peter",        abbr: "2+peter",         chapters: 3  },
  { name: "1 John",         abbr: "1+john",          chapters: 5  },
  { name: "2 John",         abbr: "2+john",          chapters: 1  },
  { name: "3 John",         abbr: "3+john",          chapters: 1  },
  { name: "Jude",           abbr: "jude",            chapters: 1  },
  { name: "Revelation",     abbr: "revelation",      chapters: 22 },
];

export interface BibleChapter {
  bookName: string;
  bookAbbr: string;
  chapter: number;
}

export interface DayReading {
  day: number;
  chapters: BibleChapter[];
  label: string;    // combined e.g. "Genesis 1–3 · Matthew 1"
  otLabel: string;  // e.g. "Genesis 1–3"
  ntLabel: string;  // e.g. "Matthew 1" (empty string on days with no NT reading)
}

// Build flat list of chapters for a given book array
function buildChapterListFrom(books: typeof BOOKS): BibleChapter[] {
  const list: BibleChapter[] = [];
  for (const book of books) {
    for (let c = 1; c <= book.chapters; c++) {
      list.push({ bookName: book.name, bookAbbr: book.abbr, chapter: c });
    }
  }
  return list;
}

// Distribute 929 OT chapters + 260 NT chapters across 365 days
// Each day: 2–3 OT chapters + 1 NT chapter (evenly spread across the year)
let _plan: DayReading[] | null = null;

export function getBiblePlan(): DayReading[] {
  if (_plan) return _plan;

  const otBooks = BOOKS.slice(0, 39);  // Genesis–Malachi (929 chapters)
  const ntBooks = BOOKS.slice(39);     // Matthew–Revelation (260 chapters)

  const otChapters = buildChapterListFrom(otBooks);
  const ntChapters = buildChapterListFrom(ntBooks);

  const days = 365;
  const otBase = Math.floor(otChapters.length / days);  // 2
  const otExtras = otChapters.length % days;            // 199 days get 3, 166 days get 2

  const plan: DayReading[] = [];
  let otIdx = 0;
  let ntIdx = 0;
  let ntAcc = 0; // Bresenham accumulator for even NT distribution

  for (let day = 1; day <= days; day++) {
    // OT portion
    const otCount = day <= otExtras ? otBase + 1 : otBase;
    const otDay = otChapters.slice(otIdx, otIdx + otCount);
    otIdx += otCount;

    // NT portion — evenly distribute 260 chapters across 365 days
    ntAcc += ntChapters.length;
    let ntDay: BibleChapter[] = [];
    if (ntAcc >= days && ntIdx < ntChapters.length) {
      ntAcc -= days;
      ntDay = [ntChapters[ntIdx++]];
    }

    const allChapters = [...otDay, ...ntDay];
    const otLabel = buildLabel(otDay);
    const ntLabel = buildLabel(ntDay);
    const label = ntDay.length > 0 ? `${otLabel} · ${ntLabel}` : otLabel;

    plan.push({ day, chapters: allChapters, label, otLabel, ntLabel });
  }

  _plan = plan;
  return _plan;
}

function buildLabel(chapters: BibleChapter[]): string {
  if (chapters.length === 0) return "";

  const groups: { book: string; nums: number[] }[] = [];
  for (const ch of chapters) {
    const last = groups[groups.length - 1];
    if (last && last.book === ch.bookName) {
      last.nums.push(ch.chapter);
    } else {
      groups.push({ book: ch.bookName, nums: [ch.chapter] });
    }
  }

  return groups.map(g => {
    const first = g.nums[0];
    const last = g.nums[g.nums.length - 1];
    if (g.nums.length === 1) return `${g.book} ${first}`;
    return `${g.book} ${first}–${last}`;
  }).join(", ");
}

// Returns the API URL for a given chapter
export function bibleApiUrl(chapter: BibleChapter, translation = "kjv"): string {
  return `https://bible-api.com/${chapter.bookAbbr}+${chapter.chapter}?translation=${translation}`;
}
