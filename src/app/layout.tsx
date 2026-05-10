import type { Metadata } from "next";
import { ReactNode } from "react";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "Obsidian — 软件实操教程", template: "%s | Obsidian" },
  description: "免费软件实操教程平台 — Photoshop, VS Code, Figma 等软件教程",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
