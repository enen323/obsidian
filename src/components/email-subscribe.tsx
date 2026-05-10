"use client";

import { useState } from "react";

export default function EmailSubscribe({ locale }: { locale: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const isZh = locale === "zh";

  return (
    <section className="rounded-lg bg-gradient-to-r from-brand-50 to-blue-50 p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900">
        {isZh ? "订阅更新" : "Stay Updated"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {isZh ? "新教程发布时接收通知" : "Get notified when new tutorials are published."}
      </p>

      {status === "success" ? (
        <p className="mt-4 text-sm text-green-600">
          {isZh ? "感谢订阅！" : "Thanks for subscribing!"}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-4 flex max-w-md gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isZh ? "your@email.com" : "you@example.com"}
            required
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {status === "loading" ? "..." : isZh ? "订阅" : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">
          {isZh ? "出错了，请重试。" : "Something went wrong. Try again."}
        </p>
      )}
    </section>
  );
}
