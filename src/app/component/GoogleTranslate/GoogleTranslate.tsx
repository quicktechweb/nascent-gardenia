"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Init function
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,bn,hi,de",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Load script once
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // 🔥 HARD REMOVE GOOGLE TOP BAR / OVERLAY
    const observer = new MutationObserver(() => {
      document
        .querySelectorAll(
          'iframe[src*="translate.google"], .goog-te-banner-frame'
        )
        .forEach((el) => el.remove());

      // reset body/html shift
      document.body.classList.remove("skiptranslate");
      document.body.style.top = "0px";
      document.documentElement.style.marginTop = "0px";
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }} />;
}
