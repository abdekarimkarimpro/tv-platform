import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TV Platform",
    description: "Online store for TV products and technician services",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
          <html lang="en">
                <body className={inter.className}>
                        <main className="min-h-screen bg-gray-100 p-4">{children}</main>main>
                </body>body>
          </html>html>
        );
}</html>
