"use client";

import { useEffect } from "react";

import { isTouchViewport, shouldRequestPwaFullscreen } from "@/lib/pwa-display-mode";

/**
 * 安卓全屏兜底：点击屏幕进入全屏模式（iOS 不支持此 API，会自动忽略）。
 *
 * world-builder（筑境）通过 window.open 开在独立窗口，不在 main-app 的 React 树内，
 * 因此拿不到 main-app 里那段「点击进全屏」的监听，会一直露出浏览器地址栏。
 * 这个组件把同一套逻辑复刻到 world-builder 窗口，挂上即可。
 */
export function AndroidFullscreen() {
  useEffect(() => {
    // 与 main-app 同源：只认触摸能力，不认主指针（pointer:coarse 在桌面模式/DeX
    // 下会报 fine，写死该条件会整段失效）。
    if (!isTouchViewport()) return;

    function tryFullscreen() {
      if (!shouldRequestPwaFullscreen()) return;
      const doc = document.documentElement;
      if (document.fullscreenElement) return;
      doc.requestFullscreen?.().catch(() => { });
    }
    // 每次点击都尝试进入全屏（退出后可重新进入）
    document.addEventListener("click", tryFullscreen);
    return () => {
      document.removeEventListener("click", tryFullscreen);
    };
  }, []);

  return null;
}
