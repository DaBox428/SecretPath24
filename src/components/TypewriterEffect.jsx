import React, { useEffect, useState } from "react";
import { Typewriter, useTypewriter } from "react-simple-typewriter";

function TypewriterEffect({ words, isFast, setIsTyping, isTyping }) {
  let wordsString = words;
  let speed = 1;

  if (isFast) {
    speed = 1;
  }
  const [text, helper] = useTypewriter({
    words: [wordsString],
    loop: 1,
    typeSpeed: speed,
  });

  const { isDelete, isType, isDelay, isDone } = helper;

  useEffect(() => {
    setIsTyping(isType);
  }, [isType]);

  return (
    <>
      <div
        className="text-left font-sans text-base antialiased"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
    </>
  );
}

export default TypewriterEffect;
