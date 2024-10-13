import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import favicon from "@/assets/favicon.ico";

import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jobify",
  description:
    "Jobify is a full-stack web application that helps users track and manage their job applications effortlessly. Organize your job search with features like application management, profile creation, real-time updates.",
  openGraph: {
    title: "Jobify - Track Your Job Applications",
    description:
      "Jobify allows users to manage their job applications with ease. Create profiles, track applications, and stay organized in your job search.",
    url: "https://mj-jobify.vercel.app/",
    siteName: "Jobify",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/853c923d-f47f-47e2-a5fd-c6025db8b94e.png?token=Uuu8_UHKNJUy41YdMtWl_PueY7LgbyPWvdc9RYEtYhA&height=604&width=1200&expires=33264826371", // URL to a preview image
        width: 1200,
        height: 630,
        alt: "Jobify Application Tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobify - Track Your Job Applications",
    description:
      "Manage and track your job applications effortlessly with Jobify. Stay organized with real-time updates, profiles, and more.",
    images: [
      "https://opengraph.b-cdn.net/production/images/853c923d-f47f-47e2-a5fd-c6025db8b94e.png?token=Uuu8_UHKNJUy41YdMtWl_PueY7LgbyPWvdc9RYEtYhA&height=604&width=1200&expires=33264826371",
    ], // URL to a preview image optimized for Twitter
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <link rel="icon" href={favicon.src} type="image/x-icon" />
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
