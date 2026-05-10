import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./posts/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dbe4ff",
          500: "#4f6ef7",
          600: "#3b5bdb",
          700: "#2b4ac7",
        },
      },
    },
  },
};
export default config;
