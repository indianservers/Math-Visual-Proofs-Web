"use client";

import { useEffect, useRef, useState } from "react";
import { VISUAL_PROOF_RESET_EVENT } from "../proof-engine/ProofCanvasHost";
import styles from "./ImportedHtmlProof.module.css";

type Props = { src: string; title: string; autoHeightOnMobile?: boolean };

/** Mount legacy proof DOM in this page. Shadow DOM scopes styles, not a browsing context. */
export default function ImportedHtmlProof({ src, title }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    const reset = () => setRevision((v) => v + 1);
    window.addEventListener(VISUAL_PROOF_RESET_EVENT, reset);
    return () => window.removeEventListener(VISUAL_PROOF_RESET_EVENT, reset);
  }, []);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const root = element.shadowRoot ?? element.attachShadow({ mode: "open" });
    const abort = new AbortController();
    const frames = new Set<number>(), timers = new Set<number>(), intervals = new Set<number>();
    const cleanups: (() => void)[] = [];
    class ScopedMutationObserver extends MutationObserver {
      constructor(callback: MutationCallback) { super(callback); cleanups.push(() => this.disconnect()); }
    }
    class ScopedResizeObserver extends ResizeObserver {
      constructor(callback: ResizeObserverCallback) { super(callback); cleanups.push(() => this.disconnect()); }
    }
    const lifecycle = new EventTarget();
    const globals: Record<PropertyKey, unknown> = {};
    let observer: ResizeObserver | undefined;
    const raf = (callback: FrameRequestCallback) => {
      if (abort.signal.aborted) return 0;
      const id = window.requestAnimationFrame((time) => { frames.delete(id); if (!abort.signal.aborted) callback(time); });
      frames.add(id); return id;
    };
    const timeout = (callback: () => void, delay?: number) => {
      const id = window.setTimeout(() => { timers.delete(id); if (!abort.signal.aborted) callback(); }, delay);
      timers.add(id); return id;
    };
    const interval = (callback: () => void, delay?: number) => {
      const id = window.setInterval(() => { if (!abort.signal.aborted) callback(); }, delay);
      intervals.add(id); return id;
    };
    const listen = (type: string, callback: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean) => {
      const target = ["load", "DOMContentLoaded", "resize"].includes(type) ? lifecycle : window;
      target.addEventListener(type, callback, options);
      cleanups.push(() => target.removeEventListener(type, callback, options));
    };
    const localWindow = new Proxy(window, {
      get(target, key) {
        if (key === "window" || key === "self" || key === "globalThis") return localWindow;
        if (key === "document") return localDocument;
        if (key === "innerWidth") return element.clientWidth;
        if (key === "innerHeight") return element.clientHeight;
        if (key === "requestAnimationFrame") return raf;
        if (key === "setTimeout") return timeout;
        if (key === "setInterval") return interval;
        if (key === "MutationObserver") return ScopedMutationObserver;
        if (key === "ResizeObserver") return ScopedResizeObserver;
        if (key === "addEventListener") return listen;
        if (key === "removeEventListener") return (type: string, callback: EventListener) => { lifecycle.removeEventListener(type, callback); window.removeEventListener(type, callback); };
        if (key === "dispatchEvent") return lifecycle.dispatchEvent.bind(lifecycle);
        if (key in globals) return globals[key];
        const value = Reflect.get(target, key, target);
        // Constructors must retain their prototypes; browser methods need their receiver.
        return typeof value === "function" && !value.prototype ? value.bind(target) : value;
      },
      set(_target, key, value) { globals[key] = value; return true; },
    });
    let body: HTMLDivElement;
    const localDocument = new Proxy(document, {
      get(target, key) {
        if (key === "body" || key === "documentElement") return body;
        if (key === "head") return root;
        if (key === "readyState") return "complete";
        if (key === "getElementById") return (id: string) => root.getElementById(id);
        if (key === "querySelector") return root.querySelector.bind(root);
        if (key === "querySelectorAll") return root.querySelectorAll.bind(root);
        if (key === "getElementsByClassName") return (name: string) => root.querySelectorAll(`.${CSS.escape(name)}`);
        if (key === "addEventListener") return (type: string, callback: EventListener, options?: AddEventListenerOptions) => {
          const target = type === "DOMContentLoaded" ? lifecycle : root;
          target.addEventListener(type, callback, options);
          cleanups.push(() => target.removeEventListener(type, callback, options));
        };
        if (key === "removeEventListener") return (type: string, callback: EventListener) => { root.removeEventListener(type, callback); lifecycle.removeEventListener(type, callback); };
        const value = Reflect.get(target, key, target);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
    const load = async () => {
      setError("");
      element.removeAttribute("data-proof-ready");
      const url = new URL(src, window.location.href);
      const response = await fetch(url, { signal: abort.signal });
      if (!response.ok) throw new Error(`Proof could not load (${response.status}).`);
      const parsed = new DOMParser().parseFromString(await response.text(), "text/html");
      const scripts = Array.from(parsed.querySelectorAll("script"));
      scripts.forEach((script) => script.remove());
      root.replaceChildren();
      const scopeCSS = (css: string) => css.replace(/:root\b/g, ":host").replace(/\bhtml\b(?=[\s,.{:#>])/g, ":host").replace(/\bbody\b(?=[\s,.{:#>])/g, ".proof-document-body");
      for (const style of parsed.querySelectorAll("style")) {
        const copy = document.createElement("style"); copy.textContent = scopeCSS(style.textContent ?? ""); root.append(copy); style.remove();
      }
      for (const link of parsed.querySelectorAll('link[rel="stylesheet"]')) {
        const href = new URL(link.getAttribute("href")!, url);
        if (href.origin === url.origin) {
          const result = await fetch(href, { signal: abort.signal });
          if (!result.ok) throw new Error(`Missing proof stylesheet: ${href.pathname}`);
          const style = document.createElement("style"); style.textContent = scopeCSS(await result.text()); root.append(style);
        } else {
          const copy = document.createElement("link"); copy.rel = "stylesheet"; copy.href = href.href; root.append(copy);
        }
      }
      body = document.createElement("div"); body.className = `proof-document-body ${parsed.body.className}`; body.innerHTML = parsed.body.innerHTML;
      for (const node of body.querySelectorAll<HTMLElement>("[src], [href]")) {
        for (const attr of ["src", "href"]) {
          const value = node.getAttribute(attr);
          if (value && !value.startsWith("#")) node.setAttribute(attr, new URL(value, url).href);
        }
      }
      root.append(body);
      const override = await fetch("/imported/chrome-overrides.css", { signal: abort.signal });
      const style = document.createElement("style");
      style.textContent = scopeCSS(await override.text()) + '\n:host{display:block;width:100%;height:100%;overflow:auto;color:#172153;font-family:Arial,sans-serif}.proof-document-body{min-height:100%!important;margin:0!important;width:100%!important}.app-sidebar,.header-bar{display:none!important}';
      root.append(style);
      let source = "const MutationObserver = window.MutationObserver; const ResizeObserver = window.ResizeObserver;\n";
      for (const script of scripts) {
        if (script.type && !["text/javascript", "application/javascript"].includes(script.type)) continue;
        if (script.src) {
          const result = await fetch(new URL(script.getAttribute("src")!, url), { signal: abort.signal });
          if (!result.ok) throw new Error(`Missing proof script: ${script.getAttribute("src")}`);
          source += '\n' + await result.text() + '\n;';
          source += '\nvar THREE = window.THREE; var katex = window.katex; var renderMathInElement = window.renderMathInElement;';
        } else source += '\n' + script.textContent + '\n;';
      }
      // Compile legacy inline handlers in the same scope as their proof functions.
      let index = 0;
      for (const node of body.querySelectorAll<HTMLElement>("*")) {
        const id = String(index++);
        for (const attribute of Array.from(node.attributes)) {
          if (!attribute.name.startsWith("on")) continue;
          node.setAttribute("data-proof-handler", id);
          source += `\ndocument.querySelector('[data-proof-handler="${id}"]').addEventListener(${JSON.stringify(attribute.name.slice(2))}, function(event){${attribute.value}\n});`;
          node.removeAttribute(attribute.name);
        }
      }
      if (abort.signal.aborted) return;
      new Function("window", "document", "requestAnimationFrame", "setTimeout", "setInterval", "globalThis", source).call(localWindow, localWindow, localDocument, raf, timeout, interval, localWindow);
      lifecycle.dispatchEvent(new Event("DOMContentLoaded")); lifecycle.dispatchEvent(new Event("load"));
      if (typeof globals.onload === "function") globals.onload.call(localWindow, new Event("load"));
      const resize = () => lifecycle.dispatchEvent(new Event("resize"));
      observer = new ResizeObserver(resize); observer.observe(element); resize();
      element.setAttribute("data-proof-ready", "true");
    };
    load().catch((cause) => { if (!abort.signal.aborted) setError(cause instanceof Error ? cause.message : "Unable to initialize proof."); });
    return () => {
      abort.abort(); observer?.disconnect(); cleanups.forEach((cleanup) => cleanup());
      frames.forEach((id) => cancelAnimationFrame(id)); timers.forEach((id) => clearTimeout(id)); intervals.forEach((id) => clearInterval(id));
      root.replaceChildren();
    };
  }, [src, revision]);
  return <div className={styles.wrap} aria-label={title}>{error && <p role="alert">{error}</p>}<div ref={host} className={styles.content} /></div>;
}
