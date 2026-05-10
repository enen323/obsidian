"use client";

import { useState, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchPost {
  title: string;
  description: string;
  url: string;
  field: string;
  software: string;
  level: string;
}

interface Props {
  posts: SearchPost[];
  searchPlaceholder?: string;
}

export default function SearchDialog({ posts, searchPlaceholder = "Search..." }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPost[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuseRef = useRef<Fuse<SearchPost>>(
    new Fuse(posts, {
      keys: ["title", "description", "software", "field"],
      threshold: 0.4,
      includeScore: true,
    })
  );

  useEffect(() => {
    fuseRef.current = new Fuse(posts, {
      keys: ["title", "description", "software", "field"],
      threshold: 0.4,
      includeScore: true,
    });
  }, [posts]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    const res = fuseRef.current.search(value);
    setResults(res.slice(0, 8).map((r) => r.item));
  };

  const navigate = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-400 hover:border-brand-300 hover:text-gray-600"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">{searchPlaceholder}</span>
        <kbd className="hidden rounded border border-gray-200 px-1.5 text-xs text-gray-400 md:inline">
          Ctrl+K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-gray-200 px-4">
              <Search className="h-5 w-5 shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
              <kbd className="shrink-0 rounded border border-gray-200 px-1.5 text-xs text-gray-400">
                ESC
              </kbd>
            </div>

            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2">
                {results.map((post) => (
                  <button
                    key={post.url}
                    onClick={() => navigate(post.url)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-500">{post.software}</div>
                    </div>
                    <span className="text-xs text-gray-400">{post.level}</span>
                  </button>
                ))}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-400">No results found.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
