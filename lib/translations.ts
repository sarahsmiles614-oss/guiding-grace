export interface Translation {
  id: string;
  label: string;
  name: string;
}

// Both translations are public domain — no license or API key required.
export const TRANSLATIONS: Translation[] = [
  { id: "kjv", label: "KJV", name: "King James Version"  },
  { id: "web", label: "WEB", name: "World English Bible" },
];

export const DEFAULT_TRANSLATION = "kjv";
