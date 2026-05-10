import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="sponsored nofollow" {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href || "#"} {...(props as any)}>
        {children}
      </Link>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => (
    <code
      className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-brand-700"
      {...(props as any)}
    >
      {children}
    </code>
  ),
  img: ({ alt, ...props }) => (
    <img alt={alt || ""} className="rounded-lg" {...props} />
  ),
};
