export function getTodayNY(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date()).replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2");
}
