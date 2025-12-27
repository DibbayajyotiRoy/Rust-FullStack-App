/**
 * Format a timestamp as relative time (e.g., "just now", "5 minutes ago")
 */
export function formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 10) {
        return "just now";
    } else if (diffSeconds < 60) {
        return `${diffSeconds} seconds ago`;
    } else if (diffMinutes === 1) {
        return "1 minute ago";
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
    } else if (diffHours === 1) {
        return "1 hour ago";
    } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
        return "1 day ago";
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        // For older dates, show the actual date
        return date.toLocaleDateString();
    }
}
