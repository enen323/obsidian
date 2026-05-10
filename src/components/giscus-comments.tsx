"use client";

import { useEffect, useRef } from "react";

export default function GiscusComments({ lang }: { lang: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "your-username/obsidian");
    script.setAttribute("data-repo-id", "YOUR_REPO_ID");
    script.setAttribute("data-category", "Comments");
    script.setAttribute("data-category-id", "YOUR_CATEGORY_ID");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", lang === "zh" ? "zh-CN" : "en");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    ref.current?.appendChild(script);
  }, [lang]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12">
      <div ref={ref} className="mt-8 border-t border-gray-200 pt-6" />
      <p className="mt-2 text-xs text-gray-400">
        Comments powered by GitHub Discussions. Set up Giscus in your repo to enable.
      </p>
    </div>
  );
}
