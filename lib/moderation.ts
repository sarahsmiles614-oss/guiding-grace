const BANNED_WORDS = [
  "fuck", "shit", "ass", "bitch", "bastard", "damn", "crap", "piss", "cock",
  "dick", "pussy", "cunt", "whore", "slut", "nigger", "nigga", "faggot", "fag",
  "retard", "retarded", "kike", "spic", "chink", "wetback", "tranny", "rape",
  "molest", "pedophile", "pedo", "kill yourself", "kys", "go die", "hate you",
  "porn", "sex", "naked", "nude", "masturbat", "orgasm", "dildo", "vibrator",
];

export function isSafe(text: string): boolean {
  const lower = text.toLowerCase().replace(/[^a-z\s]/g, "");
  return !BANNED_WORDS.some((word) => lower.includes(word));
}

export const MODERATION_ERROR = "Your post contains content that isn't allowed in this community. Please keep it uplifting and respectful. 🙏";
