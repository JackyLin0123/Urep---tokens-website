

// Simple clsx implementation (no dependency needed)
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

// Generate a random voucher code
export function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ECO-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Format a date relative to now
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// Format number with commas
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

// Truncate email for display: "john.doe@university.edu" -> "john.doe"
export function emailToName(email: string): string {
  return email.split("@")[0].replace(/[._]/g, " ");
}

// Check if an email looks like a university email
export function isUniversityEmail(email: string): boolean {
  return email.endsWith(".edu") || email.includes("university") || email.includes("uni.");
}
