import React from "react";

export function renderInlineFormatting(text: string, isUser = false): React.ReactNode[] {
  if (!text) return [];

  // Match **bold**, `code`, or *italic*
  // Non-greedy matching within a line
  const tokens = text.split(/(\*\*[\s\S]+?\*\*|`[\s\S]+?`|\*[^\s*][\s\S]*?[^\s*]\*)/g);

  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      return (
        <strong
          key={i}
          className={
            isUser
              ? "font-bold text-white"
              : "font-bold text-zinc-950 dark:text-zinc-50"
          }
        >
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      return (
        <code
          key={i}
          className={
            isUser
              ? "rounded bg-emerald-700/80 px-1 py-0.5 font-mono text-xs text-emerald-100"
              : "rounded bg-zinc-200/90 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-900 dark:text-zinc-100"
          }
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      return (
        <em key={i} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    return token;
  });
}

export type ContentBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "bullet_list"; items: string[] }
  | { type: "numbered_list"; items: string[] }
  | { type: "quote"; lines: string[] }
  | { type: "paragraph"; lines: string[] };

export function parseBlocks(content: string): ContentBlock[] {
  // First split by double newlines into major chunks
  const rawSections = content.split(/\n\s*\n/);
  const blocks: ContentBlock[] = [];

  for (const section of rawSections) {
    const rawLines = section.split("\n");
    let currentParagraph: string[] = [];
    let currentBulletList: string[] = [];
    let currentNumberedList: string[] = [];
    let currentQuote: string[] = [];

    const flushCurrent = () => {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", lines: [...currentParagraph] });
        currentParagraph = [];
      }
      if (currentBulletList.length > 0) {
        blocks.push({ type: "bullet_list", items: [...currentBulletList] });
        currentBulletList = [];
      }
      if (currentNumberedList.length > 0) {
        blocks.push({ type: "numbered_list", items: [...currentNumberedList] });
        currentNumberedList = [];
      }
      if (currentQuote.length > 0) {
        blocks.push({ type: "quote", lines: [...currentQuote] });
        currentQuote = [];
      }
    };

    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Heading: e.g. #, ##, ###
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        flushCurrent();
        blocks.push({
          type: "heading",
          level: headingMatch[1].length,
          text: headingMatch[2],
        });
        continue;
      }

      // Bullet list item
      if (/^[-*]\s+/.test(trimmed)) {
        if (currentParagraph.length > 0) flushCurrent();
        if (currentNumberedList.length > 0) flushCurrent();
        if (currentQuote.length > 0) flushCurrent();
        currentBulletList.push(trimmed.replace(/^[-*]\s+/, ""));
        continue;
      }

      // Numbered list item
      const numMatch = trimmed.match(/^\d+\.\s+(.*)$/);
      if (numMatch) {
        if (currentParagraph.length > 0) flushCurrent();
        if (currentBulletList.length > 0) flushCurrent();
        if (currentQuote.length > 0) flushCurrent();
        currentNumberedList.push(numMatch[1]);
        continue;
      }

      // Blockquote
      if (trimmed.startsWith("> ")) {
        if (currentParagraph.length > 0) flushCurrent();
        if (currentBulletList.length > 0) flushCurrent();
        if (currentNumberedList.length > 0) flushCurrent();
        currentQuote.push(trimmed.slice(2));
        continue;
      }

      // Normal paragraph line
      if (currentBulletList.length > 0) flushCurrent();
      if (currentNumberedList.length > 0) flushCurrent();
      if (currentQuote.length > 0) flushCurrent();
      currentParagraph.push(line);
    }

    flushCurrent();
  }

  return blocks;
}
