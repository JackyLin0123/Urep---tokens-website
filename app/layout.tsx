import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoToken — Campus Recycling Rewards",
  description:
    "Recycle on campus, earn tokens, redeem rewards. Join your university's sustainability movement.",
  keywords: ["recycling", "sustainability", "university", "rewards", "eco"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen leaf-pattern">
        {children}
      </body>
    </html>
  );
}
