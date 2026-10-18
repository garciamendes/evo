import type { Metadata, Viewport } from "next";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Study Hub", template: "%s · Study Hub" },
  description: "Sistema pessoal de estudos: programação, inglês e IA.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e11" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full md:flex">
        <Nav />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-8 md:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
