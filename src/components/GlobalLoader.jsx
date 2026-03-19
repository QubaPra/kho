import React, { useEffect, useRef, useState } from "react";
import { subscribe, getCount } from "../utils/loadingStore";

const Spinner = () => (
  <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status" aria-label="Ładowanie">
    <span className="absolute! -m-px! h-px! w-px! overflow-hidden! whitespace-nowrap! border-0! p-0! [clip:rect(0,0,0,0)]!">Loading...</span>
  </div>
);

export default function GlobalLoader() {
  const [count, setCount] = useState(() => getCount());
  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const sinceVisibleAtRef = useRef(0);

  const DELAY_MS = 250; // opóźnienie zanim pokażemy overlay
  const MIN_VISIBLE_MS = 1; // minimalny czas widoczności po pokazaniu

  useEffect(() => {
    const unsub = subscribe(setCount);
    return () => unsub();
  }, []);

  // Zarządzanie widocznością z anti-flicker (delay + min visible)
  useEffect(() => {
    // Czyścimy ewentualne stare timery
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (count > 0) {
      // Jeśli nie widać, ustaw opóźnione pokazanie
      if (!visible) {
        showTimerRef.current = setTimeout(() => {
          sinceVisibleAtRef.current = Date.now();
          setVisible(true);
        }, DELAY_MS);
      }
    } else {
      // count == 0 => ewentualne ukrycie po min. czasie widoczności
      if (visible) {
        const elapsed = Date.now() - sinceVisibleAtRef.current;
        const remaining = MIN_VISIBLE_MS - elapsed;
        if (remaining <= 0) {
          setVisible(false);
        } else {
          hideTimerRef.current = setTimeout(() => setVisible(false), remaining);
        }
      }
      // Jeśli jeszcze nie pokazaliśmy, a count spadł do 0, nie pokazuj
      // (showTimerRef został już wyczyszczony na początku efektu)
    }

    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [count, visible]);

  // Kursor zależny od faktycznej widoczności overlaya, nie od samego count
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (visible) {
      html.style.cursor = "wait";
      body.style.cursor = "wait";
    } else {
      html.style.cursor = "";
      body.style.cursor = "";
    }
    return () => {
      html.style.cursor = "";
      body.style.cursor = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
      <Spinner />
    </div>
  );
}
