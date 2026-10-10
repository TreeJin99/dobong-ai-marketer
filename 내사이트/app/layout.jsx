import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import Nav from "@/components/Nav";
import { site } from "@/data/site";
import { appData } from "@/data/app-data";
import "./globals.css";

export const metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: `${site.name} · ${site.promise}`,
  description: site.description,
  openGraph: {
    title: `${site.name} · ${site.promise}`,
    description: site.description,
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link className="logo" href="/">{site.name}</Link>
            <Nav />
          </div>
        </header>
        {appData.notice ? (
          <div className="notice"><div className="wrap">{appData.notice}</div></div>
        ) : null}
        {children}
        <footer className="site-footer">
          <div className="wrap">{site.name} · 만든 사람 {site.maker}</div>
        </footer>
      </body>
      {site.gaId ? <GoogleAnalytics gaId={site.gaId} /> : null}
    </html>
  );
}
