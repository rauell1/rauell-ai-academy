import { describe, expect, it } from "vitest";
import React from "react";
import { renderInlineFormatting } from "../src/lib/formatting";

describe("Markdown text formatting", () => {
  it("properly identifies and bolds text between **", () => {
    const input = "Welcome to **Academy AI Mentor** and **Goal, context, task**!";
    const nodes = renderInlineFormatting(input, false);

    // Expect React nodes where ** tokens are transformed to <strong>
    const strongNodes = nodes.filter(
      (node): node is React.ReactElement<{ children: React.ReactNode }> =>
        React.isValidElement<{ children: React.ReactNode }>(node) && node.type === "strong",
    );

    expect(strongNodes.length).toBe(2);
    expect(strongNodes[0].props.children).toBe("Academy AI Mentor");
    expect(strongNodes[1].props.children).toBe("Goal, context, task");
  });

  it("handles inline code wrapped in backticks", () => {
    const input = "Run `npm run build` to verify";
    const nodes = renderInlineFormatting(input, false);

    const codeNodes = nodes.filter(
      (node): node is React.ReactElement<{ children: React.ReactNode }> =>
        React.isValidElement<{ children: React.ReactNode }>(node) && node.type === "code",
    );

    expect(codeNodes.length).toBe(1);
    expect(codeNodes[0].props.children).toBe("npm run build");
  });

  it("handles mixed bold and plain text gracefully", () => {
    const input = "1. **Quality Control Manager** — audit edge cases and security.";
    const nodes = renderInlineFormatting(input, false);

    const strongNodes = nodes.filter(
      (node): node is React.ReactElement<{ children: React.ReactNode }> =>
        React.isValidElement<{ children: React.ReactNode }>(node) && node.type === "strong",
    );

    expect(strongNodes.length).toBe(1);
    expect(strongNodes[0].props.children).toBe("Quality Control Manager");
  });
});
