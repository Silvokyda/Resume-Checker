import { useEffect, useState } from "react";

const letterColors = {
  S: "bg-gradient-to-tr from-pink-500 to-blue-500",
  A: "bg-green-500/50",
  B: "bg-green-400/50",
  C: "bg-yellow-400/50",
  " ": "bg-white/30",
} as const;

const letterDescriptions = {
  S: "The CV follows all of standard recommendations for format and content, and will yield optimal results in interview processes",
  A: "The CV has minor issues but recruiters will still be able to effectively evaluate your profile. However, improvements are always beneficial",
  B: "The CV has noticeable issues that may reduce interview opportunities and create negative impressions with hiring teams. We recommend addressing the highlighted items",
  C: "The CV will likely be quickly rejected during screenings. We recommend completely rebuilding your resume using our template",
  " ": "",
} as const;

type Letter = keyof typeof letterColors;

const letterKeys = Object.keys(letterColors) as Array<Letter>;

function loadingStyles(l: string) {
  if (l !== " ") return "";

  return "animate-pulse";
}

export default function Score({ letter }: { letter?: string }) {
  const [idx, setIdx] = useState(letterKeys.length - 1);

  useEffect(() => {
    const index = letterKeys.indexOf(letter as Letter);
    if (index !== -1) {
      setIdx(index);
    }
  }, [letter]);

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
      <div className="overflow-hidden duration-300 w-16 h-16 shrink-0 md:w-20 md:h-20 rounded-lg grid place-items-center border-2 border-black/60 dark:border-white/60">
        <div
          style={{
            /** @ts-expect-error we are using css props the proper way */
            "--ty": `${idx * 4}rem`,
            "--md-ty": `${idx * 5}rem`,
          }}
          className={`transition-transform duration-1000 delay-150 flex flex-col -ml-[2px] -mt-[2px] -translate-y-[var(--ty)] md:-translate-y-[var(--md-ty)]`}
        >
          {letterKeys.map((l) => (
            <span
              key={l}
              className={`md:text-xl text-white font-bold w-16 h-16 md:w-20 md:h-20 flex items-center justify-center ${letterColors[l]} ${loadingStyles(l)}`}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {letter && (
        <p className="text-center md:text-left max-w-md">
          {letterDescriptions[letter as Letter]}
        </p>
      )}
    </div>
  );
}