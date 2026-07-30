"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".animate-rise, .animate-rise-delay");
    if (!els.length) return;

    document.documentElement.classList.add("js-scroll");

    const alreadyVisible: Element[] = [];
    const toObserve: Element[] = [];

    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        alreadyVisible.push(el);
      } else {
        toObserve.push(el);
      }
    });

    requestAnimationFrame(() => {
      alreadyVisible.forEach((el) => el.classList.add("is-visible"));
    });

    if (!toObserve.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px 50px 0px" }
    );

    toObserve.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
