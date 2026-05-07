import { cn } from "@/lib/utils";
import React from "react";

interface CodeWindowProps {
  code: string;
  language?: string;
  className?: string;
}

const keywords = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "import",
  "from",
  "export",
  "default",
  "if",
  "else",
  "async",
  "await",
  "new",
  "class",
  "extends",
]);

const booleans = new Set(["true", "false", "null", "undefined"]);

const tokenizeLine = (line: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let buf = "";

  const flush = () => {
    if (buf) {
      nodes.push(buf);
      buf = "";
    }
  };

  while (i < line.length) {
    // Comments
    if (line[i] === "/" && line[i + 1] === "/") {
      flush();
      nodes.push(
        <span key={i} style={{ color: "#6b7280" }}>
          {line.slice(i)}
        </span>
      );
      return nodes;
    }

    // Strings
    if (line[i] === "'" || line[i] === '"' || line[i] === "`") {
      flush();
      const q = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== q) j++;
      j++;
      nodes.push(
        <span key={i} style={{ color: "#34d399" }}>
          {line.slice(i, j)}
        </span>
      );
      i = j;
      continue;
    }

    // Words
    if (/[a-zA-Z_$]/.test(line[i])) {
      flush();
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (keywords.has(word)) {
        nodes.push(
          <span key={i} style={{ color: "#a78bfa" }}>
            {word}
          </span>
        );
      } else if (booleans.has(word)) {
        nodes.push(
          <span key={i} style={{ color: "#fbbf24" }}>
            {word}
          </span>
        );
      } else {
        nodes.push(word);
      }
      i = j;
      continue;
    }

    // Numbers
    if (/\d/.test(line[i])) {
      flush();
      let j = i;
      while (j < line.length && /\d/.test(line[j])) j++;
      nodes.push(
        <span key={i} style={{ color: "#fcd34d" }}>
          {line.slice(i, j)}
        </span>
      );
      i = j;
      continue;
    }

    buf += line[i];
    i++;
  }

  flush();
  return nodes;
};

export const CodeWindow = ({
  code,
  language = "typescript",
  className,
}: CodeWindowProps) => {
  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "rounded-lg bg-graphite overflow-hidden shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10">
        <div
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
          style={{ backgroundColor: "#ef4444" }}
        />
        <div
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
          style={{ backgroundColor: "#eab308" }}
        />
        <div
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
          style={{ backgroundColor: "#22c55e" }}
        />
        <span className="ml-2 text-[10px] sm:text-xs font-mono" style={{ color: "#9ca3af" }}>
          {language}
        </span>
      </div>
      <div className="p-2 sm:p-4 overflow-x-auto">
        <pre
          className="text-xs sm:text-sm font-mono leading-relaxed"
          style={{ color: "#d1d5db" }}
        >
          {lines.map((line, idx) => (
            <div key={idx}>
              {tokenizeLine(line)}
              {"\n"}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
