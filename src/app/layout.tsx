import type { Metadata } from "next";
import { CharacterProvider } from "@/contexts/CharacterContext";
import { preloadEssentialAssets } from "@/lib/imagePreloader";
import "./globals.css";

// Start preloading essential assets immediately
if (typeof window !== 'undefined') {
  preloadEssentialAssets().catch(console.error);
}

export const metadata: Metadata = {
  title: "Character Creator App",
  description: "AI-powered character creation and customization app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <CharacterProvider>
          <div className="fixed top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm z-50">
            <div className="text-xs opacity-75">
              Use ← → arrow keys to navigate pages
            </div>
          </div>
          {children}
        </CharacterProvider>
      </body>
    </html>
  );
}
