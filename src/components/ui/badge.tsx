import { cn } from "@/lib/utils";

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function Badge({
  level,
  className,
}: {
  level: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        levelColors[level] || "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {level}
    </span>
  );
}
