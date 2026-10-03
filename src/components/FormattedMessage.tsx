import React from "react";
import { parseBlocks, renderInlineFormatting } from "@/lib/formatting";

export function FormattedMessage({
  content,
  isUser = false,
  className = "",
}: {
  content: string;
  isUser?: boolean;
  className?: string;
}) {
  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-2.5 leading-relaxed ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "heading": {
            const Tag = block.level <= 2 ? "h3" : "h4";
            return (
              <Tag
                key={idx}
                className={`font-bold mt-3 mb-1 text-sm tracking-tight ${
                  isUser ? "text-white" : "text-zinc-950 dark:text-zinc-50"
                }`}
              >
                {renderInlineFormatting(block.text, isUser)}
              </Tag>
            );
          }
          case "bullet_list":
            return (
              <ul
                key={idx}
                className="my-1.5 list-disc pl-5 space-y-1 text-inherit"
              >
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    {renderInlineFormatting(item, isUser)}
                  </li>
                ))}
              </ul>
            );
          case "numbered_list":
            return (
              <ol
                key={idx}
                className="my-1.5 list-decimal pl-5 space-y-1 text-inherit"
              >
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    {renderInlineFormatting(item, isUser)}
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={idx}
                className={`my-2 border-l-2 pl-3 italic text-xs ${
                  isUser
                    ? "border-white/50 text-emerald-100"
                    : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {block.lines.map((line, lIdx) => (
                  <div key={lIdx}>{renderInlineFormatting(line, isUser)}</div>
                ))}
              </blockquote>
            );
          case "paragraph":
          default:
            return (
              <p key={idx} className="mb-2 last:mb-0">
                {block.lines.map((line, lIdx) => (
                  <React.Fragment key={lIdx}>
                    {lIdx > 0 && <br />}
                    {renderInlineFormatting(line, isUser)}
                  </React.Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
