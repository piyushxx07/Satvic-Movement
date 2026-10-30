"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const messages = [
  "Welcome to Satvic Movement",
  "Every video, in every language",
  "A little more understood, everywhere",
];

export default function Welcome() {
  const router = useRouter();
  const [visibleText, setVisibleText] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let phraseIndex = 0;
    let position = 0;

    const typeNextCharacter = () => {
      const phrase = messages[phraseIndex];
      position += 1;
      setVisibleText(phrase.slice(0, position));

      if (position < phrase.length) {
        timer = setTimeout(typeNextCharacter, 58);
        return;
      }

      timer = setTimeout(() => {
        if (phraseIndex === messages.length - 1) {
          setIsExiting(true);
          timer = setTimeout(() => router.replace("/home"), 460);
          return;
        }

        const eraseCharacter = () => {
          position -= 1;
          setVisibleText(phrase.slice(0, position));
          if (position > 0) {
            timer = setTimeout(eraseCharacter, 20);
          } else {
            phraseIndex += 1;
            timer = setTimeout(typeNextCharacter, 250);
          }
        };

        eraseCharacter();
      }, 1100);
    };

    timer = setTimeout(typeNextCharacter, 350);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className={`typing-page${isExiting ? " is-exiting" : ""}`}>
      <h1 className="typing-message" aria-label={messages.join(". ")}>
        <span aria-hidden="true">{visibleText}</span>
        <span className="typing-cursor" aria-hidden="true">|</span>
      </h1>
    </main>
  );
}
