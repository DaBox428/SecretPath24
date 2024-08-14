import React, { useState } from "react";
import { Typewriter, useTypewriter } from "react-simple-typewriter";

function TypewriterEffect({ words, isFast }) {
  let wordsString = words;
  let speed = 0.1;

  if (isFast) {
    speed = 0.1;
  }
  const [text, helper] = useTypewriter({
    words: [wordsString],
    loop: 1,
    typeSpeed: speed,
  });

  const { isDelete, isType, isDelay, isDone } = helper;

  return (
    <>
      <div
        className="text-left font-sans text-base antialiased"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
      {console.log(isDone)}
    </>
  );
}

export default TypewriterEffect;
