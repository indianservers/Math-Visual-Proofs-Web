"use client";

import clsx from "clsx";
import katex from "katex";
import { useMemo } from "react";

type MathFormulaProps = {
  latex: string;
  className?: string;
  display?: boolean;
  label?: string;
};

/** Shared accessible KaTeX renderer for proof panels and live formulas. */
export default function MathFormula({
  latex,
  className,
  display = false,
  label,
}: MathFormulaProps) {
  const html = useMemo(
    () =>
      katex.renderToString(latex, {
        displayMode: display,
        output: "htmlAndMathml",
        strict: "ignore",
        throwOnError: false,
      }),
    [display, latex],
  );
  return (
    <span
      className={clsx("math-formula", className)}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
