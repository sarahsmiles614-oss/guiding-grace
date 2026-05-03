// ── Old Testament books ───────────────────────────────────────────────────────
const OT_BOOKS: { name: string; abbr: string; chapters: number }[] = [
  { name: "Genesis",          abbr: "genesis",         chapters: 50  },
  { name: "Exodus",           abbr: "exodus",          chapters: 40  },
  { name: "Leviticus",        abbr: "leviticus",       chapters: 27  },
  { name: "Numbers",          abbr: "numbers",         chapters: 36  },
  { name: "Deuteronomy",      abbr: "deuteronomy",     chapters: 34  },
  { name: "Joshua",           abbr: "joshua",          chapters: 24  },
  { name: "Judges",           abbr: "judges",          chapters: 21  },
  { name: "Ruth",             abbr: "ruth",            chapters: 4   },
  { name: "1 Samuel",         abbr: "1+samuel",        chapters: 31  },
  { name: "2 Samuel",         abbr: "2+samuel",        chapters: 24  },
  { name: "1 Kings",          abbr: "1+kings",         chapters: 22  },
  { name: "2 Kings",          abbr: "2+kings",         chapters: 25  },
  { name: "1 Chronicles",     abbr: "1+chronicles",    chapters: 29  },
  { name: "2 Chronicles",     abbr: "2+chronicles",    chapters: 36  },
  { name: "Ezra",             abbr: "ezra",            chapters: 10  },
  { name: "Nehemiah",         abbr: "nehemiah",        chapters: 13  },
  { name: "Esther",           abbr: "esther",          chapters: 10  },
  { name: "Job",              abbr: "job",             chapters: 42  },
  { name: "Psalms",           abbr: "psalms",          chapters: 150 },
  { name: "Proverbs",         abbr: "proverbs",        chapters: 31  },
  { name: "Ecclesiastes",     abbr: "ecclesiastes",    chapters: 12  },
  { name: "Song of Solomon",  abbr: "song+of+solomon", chapters: 8   },
  { name: "Isaiah",           abbr: "isaiah",          chapters: 66  },
  { name: "Jeremiah",         abbr: "jeremiah",        chapters: 52  },
  { name: "Lamentations",     abbr: "lamentations",    chapters: 5   },
  { name: "Ezekiel",          abbr: "ezekiel",         chapters: 48  },
  { name: "Daniel",           abbr: "daniel",          chapters: 12  },
  { name: "Hosea",            abbr: "hosea",           chapters: 14  },
  { name: "Joel",             abbr: "joel",            chapters: 3   },
  { name: "Amos",             abbr: "amos",            chapters: 9   },
  { name: "Obadiah",          abbr: "obadiah",         chapters: 1   },
  { name: "Jonah",            abbr: "jonah",           chapters: 4   },
  { name: "Micah",            abbr: "micah",           chapters: 7   },
  { name: "Nahum",            abbr: "nahum",           chapters: 3   },
  { name: "Habakkuk",         abbr: "habakkuk",        chapters: 3   },
  { name: "Zephaniah",        abbr: "zephaniah",       chapters: 3   },
  { name: "Haggai",           abbr: "haggai",          chapters: 2   },
  { name: "Zechariah",        abbr: "zechariah",       chapters: 14  },
  { name: "Malachi",          abbr: "malachi",         chapters: 4   },
];

// ── New Testament books ───────────────────────────────────────────────────────
const NT_BOOKS: { name: string; abbr: string; chapters: number }[] = [
  { name: "Matthew",          abbr: "matthew",         chapters: 28  },
  { name: "Mark",             abbr: "mark",            chapters: 16  },
  { name: "Luke",             abbr: "luke",            chapters: 24  },
  { name: "John",             abbr: "john",            chapters: 21  },
  { name: "Acts",             abbr: "acts",            chapters: 28  },
  { name: "Romans",           abbr: "romans",          chapters: 16  },
  { name: "1 Corinthians",    abbr: "1+corinthians",   chapters: 16  },
  { name: "2 Corinthians",    abbr: "2+corinthians",   chapters: 13  },
  { name: "Galatians",        abbr: "galatians",       chapters: 6   },
  { name: "Ephesians",        abbr: "ephesians",       chapters: 6   },
  { name: "Philippians",      abbr: "philippians",     chapters: 4   },
  { name: "Colossians",       abbr: "colossians",      chapters: 4   },
  { name: "1 Thessalonians",  abbr: "1+thessalonians", chapters: 5   },
  { name: "2 Thessalonians",  abbr: "2+thessalonians", chapters: 3   },
  { name: "1 Timothy",        abbr: "1+timothy",       chapters: 6   },
  { name: "2 Timothy",        abbr: "2+timothy",       chapters: 4   },
  { name: "Titus",            abbr: "titus",           chapters: 3   },
  { name: "Philemon",         abbr: "philemon",        chapters: 1   },
  { name: "Hebrews",          abbr: "hebrews",         chapters: 13  },
  { name: "James",            abbr: "james",           chapters: 5   },
  { name: "1 Peter",          abbr: "1+peter",         chapters: 5   },
  { name: "2 Peter",          abbr: "2+peter",         chapters: 3   },
  { name: "1 John",           abbr: "1+john",          chapters: 5   },
  { name: "2 John",           abbr: "2+john",          chapters: 1   },
  { name: "3 John",           abbr: "3+john",          chapters: 1   },
  { name: "Jude",             abbr: "jude",            chapters: 1   },
  { name: "Revelation",       abbr: "revelation",      chapters: 22  },
];

// ── Canonical = OT + NT ───────────────────────────────────────────────────────
const CANONICAL_BOOKS = [...OT_BOOKS, ...NT_BOOKS];

// ── Chronological order ───────────────────────────────────────────────────────
const CHRONOLOGICAL_BOOKS: { name: string; abbr: string; chapters: number }[] = [
  // The Patriarchs
  { name: "Genesis",          abbr: "genesis",         chapters: 50  },
  { name: "Job",              abbr: "job",             chapters: 42  },
  // The Law
  { name: "Exodus",           abbr: "exodus",          chapters: 40  },
  { name: "Leviticus",        abbr: "leviticus",       chapters: 27  },
  { name: "Numbers",          abbr: "numbers",         chapters: 36  },
  { name: "Deuteronomy",      abbr: "deuteronomy",     chapters: 34  },
  // Conquest & Settlement
  { name: "Joshua",           abbr: "joshua",          chapters: 24  },
  { name: "Judges",           abbr: "judges",          chapters: 21  },
  { name: "Ruth",             abbr: "ruth",            chapters: 4   },
  // The United Kingdom
  { name: "1 Samuel",         abbr: "1+samuel",        chapters: 31  },
  { name: "2 Samuel",         abbr: "2+samuel",        chapters: 24  },
  { name: "Psalms",           abbr: "psalms",          chapters: 150 },
  { name: "1 Kings",          abbr: "1+kings",         chapters: 22  },
  { name: "Proverbs",         abbr: "proverbs",        chapters: 31  },
  { name: "Ecclesiastes",     abbr: "ecclesiastes",    chapters: 12  },
  { name: "Song of Solomon",  abbr: "song+of+solomon", chapters: 8   },
  // The Divided Kingdom & Early Prophets
  { name: "Obadiah",          abbr: "obadiah",         chapters: 1   },
  { name: "Joel",             abbr: "joel",            chapters: 3   },
  { name: "Jonah",            abbr: "jonah",           chapters: 4   },
  { name: "Amos",             abbr: "amos",            chapters: 9   },
  { name: "Hosea",            abbr: "hosea",           chapters: 14  },
  { name: "Isaiah",           abbr: "isaiah",          chapters: 66  },
  { name: "Micah",            abbr: "micah",           chapters: 7   },
  { name: "2 Kings",          abbr: "2+kings",         chapters: 25  },
  // The Exile
  { name: "Nahum",            abbr: "nahum",           chapters: 3   },
  { name: "Zephaniah",        abbr: "zephaniah",       chapters: 3   },
  { name: "Habakkuk",         abbr: "habakkuk",        chapters: 3   },
  { name: "Jeremiah",         abbr: "jeremiah",        chapters: 52  },
  { name: "Lamentations",     abbr: "lamentations",    chapters: 5   },
  { name: "Ezekiel",          abbr: "ezekiel",         chapters: 48  },
  { name: "Daniel",           abbr: "daniel",          chapters: 12  },
  // Post-Exile & Return
  { name: "1 Chronicles",     abbr: "1+chronicles",    chapters: 29  },
  { name: "2 Chronicles",     abbr: "2+chronicles",    chapters: 36  },
  { name: "Haggai",           abbr: "haggai",          chapters: 2   },
  { name: "Zechariah",        abbr: "zechariah",       chapters: 14  },
  { name: "Ezra",             abbr: "ezra",            chapters: 10  },
  { name: "Nehemiah",         abbr: "nehemiah",        chapters: 13  },
  { name: "Esther",           abbr: "esther",          chapters: 10  },
  { name: "Malachi",          abbr: "malachi",         chapters: 4   },
  // The Gospels
  { name: "Matthew",          abbr: "matthew",         chapters: 28  },
  { name: "Mark",             abbr: "mark",            chapters: 16  },
  { name: "Luke",             abbr: "luke",            chapters: 24  },
  { name: "John",             abbr: "john",            chapters: 21  },
  // The Early Church
  { name: "Acts",             abbr: "acts",            chapters: 28  },
  { name: "James",            abbr: "james",           chapters: 5   },
  { name: "Galatians",        abbr: "galatians",       chapters: 6   },
  { name: "1 Thessalonians",  abbr: "1+thessalonians", chapters: 5   },
  { name: "2 Thessalonians",  abbr: "2+thessalonians", chapters: 3   },
  { name: "1 Corinthians",    abbr: "1+corinthians",   chapters: 16  },
  { name: "2 Corinthians",    abbr: "2+corinthians",   chapters: 13  },
  { name: "Romans",           abbr: "romans",          chapters: 16  },
  // Paul's Prison Letters
  { name: "Philippians",      abbr: "philippians",     chapters: 4   },
  { name: "Colossians",       abbr: "colossians",      chapters: 4   },
  { name: "Philemon",         abbr: "philemon",        chapters: 1   },
  { name: "Ephesians",        abbr: "ephesians",       chapters: 6   },
  // Paul's Later Letters
  { name: "1 Timothy",        abbr: "1+timothy",       chapters: 6   },
  { name: "Titus",            abbr: "titus",           chapters: 3   },
  { name: "1 Peter",          abbr: "1+peter",         chapters: 5   },
  { name: "2 Timothy",        abbr: "2+timothy",       chapters: 4   },
  { name: "2 Peter",          abbr: "2+peter",         chapters: 3   },
  { name: "Hebrews",          abbr: "hebrews",         chapters: 13  },
  { name: "Jude",             abbr: "jude",            chapters: 1   },
  // John's Later Writings
  { name: "1 John",           abbr: "1+john",          chapters: 5   },
  { name: "2 John",           abbr: "2+john",          chapters: 1   },
  { name: "3 John",           abbr: "3+john",          chapters: 1   },
  { name: "Revelation",       abbr: "revelation",      chapters: 22  },
];

// ── Psalms & Proverbs only ────────────────────────────────────────────────────
const PSALMS_PROVERBS_BOOKS: { name: string; abbr: string; chapters: number }[] = [
  { name: "Psalms",   abbr: "psalms",   chapters: 150 },
  { name: "Proverbs", abbr: "proverbs", chapters: 31  },
];

// ── NT + Psalms & Proverbs ────────────────────────────────────────────────────
const NT_PSALMS_PROVERBS_BOOKS = [...NT_BOOKS, ...PSALMS_PROVERBS_BOOKS];

export type PlanOrder =
  | "canonical"
  | "chronological"
  | "nt-only"
  | "ot-only"
  | "psalms-proverbs"
  | "nt-psalms-proverbs"
  | "interleaved";

export const PLAN_INFO: Record<PlanOrder, { label: string; desc: string; emoji: string; days: number }> = {
  "canonical":          { label: "Canonical",         desc: "Traditional Bible order",        emoji: "📖", days: 365 },
  "chronological":      { label: "Chronological",     desc: "By when events happened",        emoji: "🕰️", days: 365 },
  "nt-only":            { label: "New Testament",     desc: "NT only • 90 days",              emoji: "✝️",  days: 90  },
  "ot-only":            { label: "Old Testament",     desc: "OT only • 365 days",             emoji: "📜",  days: 365 },
  "psalms-proverbs":    { label: "Psalms & Proverbs", desc: "Daily wisdom • 90 days",         emoji: "🕊️",  days: 90  },
  "nt-psalms-proverbs": { label: "NT + Wisdom",       desc: "NT with Psalms & Proverbs",      emoji: "🌿",  days: 365 },
  "interleaved":        { label: "OT + NT Daily",     desc: "Both testaments every day",      emoji: "⚖️",  days: 365 },
};

export interface BibleChapter {
  bookName: string;
  bookAbbr: string;
  chapter: number;
}

export interface DayReading {
  day: number;
  chapters: BibleChapter[];
  label: string;
  otLabel: string;
  ntLabel: string;
}

const _plans: Partial<Record<PlanOrder, DayReading[]>> = {};

// ── Build a simple sequential plan ───────────────────────────────────────────
function buildPlan(
  books: { name: string; abbr: string; chapters: number }[],
  totalDays: number
): DayReading[] {
  const allChapters: BibleChapter[] = [];
  for (const book of books) {
    for (let c = 1; c <= book.chapters; c++) {
      allChapters.push({ bookName: book.name, bookAbbr: book.abbr, chapter: c });
    }
  }

  const total = allChapters.length;
  const base = Math.floor(total / totalDays);
  const extras = total % totalDays;

  const plan: DayReading[] = [];
  let idx = 0;

  for (let day = 1; day <= totalDays; day++) {
    const count = day <= extras ? base + 1 : base;
    const dayChapters = allChapters.slice(idx, idx + count);
    idx += count;
    const label = buildLabel(dayChapters);
    plan.push({ day, chapters: dayChapters, label, otLabel: label, ntLabel: "" });
  }

  return plan;
}

// ── Build an interleaved OT+NT plan (both testaments each day) ────────────────
function buildInterleavedPlan(): DayReading[] {
  const otChapters: BibleChapter[] = [];
  for (const book of OT_BOOKS) {
    for (let c = 1; c <= book.chapters; c++) {
      otChapters.push({ bookName: book.name, bookAbbr: book.abbr, chapter: c });
    }
  }

  const ntChapters: BibleChapter[] = [];
  for (const book of NT_BOOKS) {
    for (let c = 1; c <= book.chapters; c++) {
      ntChapters.push({ bookName: book.name, bookAbbr: book.abbr, chapter: c });
    }
  }

  const DAYS = 365;
  const plan: DayReading[] = [];

  for (let day = 1; day <= DAYS; day++) {
    const otStart = Math.floor((day - 1) * otChapters.length / DAYS);
    const otEnd   = Math.floor(day * otChapters.length / DAYS);
    const ntStart = Math.floor((day - 1) * ntChapters.length / DAYS);
    const ntEnd   = Math.floor(day * ntChapters.length / DAYS);

    const otDay = otChapters.slice(otStart, otEnd);
    const ntDay = ntChapters.slice(ntStart, ntEnd);
    const dayChapters = [...otDay, ...ntDay];

    const otLbl = buildLabel(otDay);
    const ntLbl = buildLabel(ntDay);
    const label = [otLbl, ntLbl].filter(Boolean).join(" · ");

    plan.push({ day, chapters: dayChapters, label, otLabel: otLbl, ntLabel: ntLbl });
  }

  return plan;
}

export function getBiblePlan(order: PlanOrder = "canonical"): DayReading[] {
  if (_plans[order]) return _plans[order]!;

  let plan: DayReading[];

  switch (order) {
    case "canonical":
      plan = buildPlan(CANONICAL_BOOKS, 365);
      break;
    case "chronological":
      plan = buildPlan(CHRONOLOGICAL_BOOKS, 365);
      break;
    case "nt-only":
      plan = buildPlan(NT_BOOKS, 90);
      break;
    case "ot-only":
      plan = buildPlan(OT_BOOKS, 365);
      break;
    case "psalms-proverbs":
      plan = buildPlan(PSALMS_PROVERBS_BOOKS, 90);
      break;
    case "nt-psalms-proverbs":
      plan = buildPlan(NT_PSALMS_PROVERBS_BOOKS, 365);
      break;
    case "interleaved":
      plan = buildInterleavedPlan();
      break;
    default:
      plan = buildPlan(CANONICAL_BOOKS, 365);
  }

  _plans[order] = plan;
  return plan;
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
    const last  = g.nums[g.nums.length - 1];
    if (g.nums.length === 1) return `${g.book} ${first}`;
    return `${g.book} ${first}–${last}`;
  }).join(", ");
}

export function bibleApiUrl(chapter: BibleChapter, translation = "kjv"): string {
  return `https://bible-api.com/${chapter.bookAbbr}+${chapter.chapter}?translation=${translation}`;
}
