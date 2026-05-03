export interface Translation {
  id: string;
  label: string;
  name: string;
  requiresKey: boolean;
}

// Free translations use bible-api.com (no key needed).
// Others use API.Bible — requires NEXT_PUBLIC_BIBLE_API_KEY in your .env.
//
// To find the correct bibleId for a translation:
//   curl -H "api-key: YOUR_KEY" https://api.scripture.api.bible/v1/bibles
// Then update the id fields below with the ids from that response.
export const TRANSLATIONS: Translation[] = [
  { id: "kjv",                  label: "KJV",  name: "King James Version",          requiresKey: false },
  { id: "web",                  label: "WEB",  name: "World English Bible",          requiresKey: false },
  { id: "f421fe261da7624f-01",  label: "ESV",  name: "English Standard Version",    requiresKey: true  },
  { id: "78a9f6124f344018-01",  label: "NIV",  name: "New International Version",   requiresKey: true  },
  { id: "65eec8e0b60e656b-01",  label: "NLT",  name: "New Living Translation",      requiresKey: true  },
  { id: "7142879509583d59-04",  label: "AMP",  name: "Amplified Bible",             requiresKey: true  },
  { id: "9879dbb7cfe39e4d-04",  label: "MSG",  name: "The Message",                 requiresKey: true  },
];

export const DEFAULT_TRANSLATION = "kjv";
