import type { Metadata } from "next";
import "./globals.css";
import "./components/ui/ui.css";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://sagarsehwag.github.io/prosemirror-mechanics"),
  icons: {
    icon: "/prosemirror-icon.svg",
    shortcut: "/prosemirror-icon.svg",
    apple: "/prosemirror-icon.svg",
  },
  title: "Editor · ProseMirror",
  description:
    "Interactive demos for ProseMirror and rich text editors. Explore schema, state, transforms, view, positions, plugins, contentEditable, selection, and more.",
  openGraph: {
    title: "Editor · ProseMirror",
      description:
        "Interactive demos for ProseMirror and rich text editors. Explore schema, state, transforms, and more.",
    images: [
      {
        url: "/editor-mechanics-og.png",
        width: 1200,
        height: 630,
        alt: "Editor · ProseMirror - Interactive demos for schema, state, transforms & more",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Editor · ProseMirror",
      description:
        "Interactive demos for ProseMirror and rich text editors. Explore schema, state, transforms, and more.",
    images: ["/editor-mechanics-og.png"],
  },
};

const ANTI_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem('theme-override');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}else{document.documentElement.dataset.theme=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f0f0f" />
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
