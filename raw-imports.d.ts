declare module "*.html?raw" {
  const content: string;
  export default content;
}

declare module "react-katex" {
  import type { ComponentType } from "react";
  export const InlineMath: ComponentType<{
    math?: string;
    children?: string;
    errorColor?: string;
    renderError?: (error: Error) => JSX.Element;
  }>;
  export const BlockMath: ComponentType<{
    math?: string;
    children?: string;
    errorColor?: string;
    renderError?: (error: Error) => JSX.Element;
  }>;
}
