import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waste Watcher",
  description: "AI assisted IOT based Waste Management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
