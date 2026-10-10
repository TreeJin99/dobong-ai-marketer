"use client";
// 위 메뉴 (서비스 · 소개). 지금 보고 있는 페이지에 색이 들어갑니다.
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();
  const isAbout = path.startsWith("/about");
  return (
    <nav className="nav">
      <Link href="/" aria-current={isAbout ? undefined : "page"}>서비스</Link>
      <Link href="/about" aria-current={isAbout ? "page" : undefined}>소개</Link>
    </nav>
  );
}
