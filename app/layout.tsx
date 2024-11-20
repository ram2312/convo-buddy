import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LoaderWrapper from "./components/LoaderWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ConvoBuddy - Your Personal Social Skills Trainer",
  description: "Join ConvoBuddy to enhance your social skills through personalized conversations and training.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable ?? ""} ${geistMono.variable ?? ""} antialiased bg-gray-50 text-gray-900`}
      >
        <LoaderWrapper>{children}</LoaderWrapper>
      </body>
    </html>
  );
}
