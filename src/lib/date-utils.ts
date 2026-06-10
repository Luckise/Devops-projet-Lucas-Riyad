export function formatDate(dateStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return dateStr;
}

export function formatTime(timeStr: string): string {
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
  }
  return timeStr;
}

export function isEventPast(event: { date: string; time?: string }): boolean {
  if (!event.date) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
    const timeStr = event.time || "00:00";
    const dateTime = new Date(`${event.date}T${timeStr}`);
    dateTime.setHours(dateTime.getHours() + 1);
    return dateTime < new Date();
  }
  return false;
}

export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = a.date.match(/^\d{4}-\d{2}-\d{2}$/) ? a.date : "9999-99-99";
    const dateB = b.date.match(/^\d{4}-\d{2}-\d{2}$/) ? b.date : "9999-99-99";
    return dateA.localeCompare(dateB);
  });
}
