"use client";

import { useEffect, useRef, useState } from "react";

import { arcPath } from "@/components/utils/arc-path";
import { polarToCartesian } from "@/components/utils/polar-to-cartesian";
import { Button } from "../ui/button";
import { Slot } from "./types";

interface SpinnerProps {
  slots: Slot[];
  start: () => void;
  isSpinning: boolean;
}
export const Spinner = ({ slots, start, isSpinning }: SpinnerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!window) return;
    if (!document) return;
    require("jquery.easing");
    setMounted(true);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        id="spin_wrapper"
        ref={ref}
        className="absolute flex  aspect-square  max-h-[500px] w-full max-w-[500px] items-center justify-center lg:h-full lg:w-auto"
      >
        <div className="relative flex aspect-square h-full w-full items-center justify-center">
          <Button
            onClick={start}
            disabled={isSpinning}
            className="absolute left-1/2 top-1/2 z-[1] h-[48px] w-[48px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          >
            SPIN
          </Button>

          <div
            className="h-full w-full rounded-full border-2 border-white"
            style={{
              boxShadow:
                "0 0 10px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            {mounted && <SpinnerSvg slots={slots} />}
          </div>

          <div className="absolute left-1/2 top-0 -mt-5 origin-bottom -translate-x-1/2">
            <div className=" text-rose-600" id="spin-arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="currentColor"
                viewBox="0 0 16 16"
                stroke="#ffffff"
                strokeWidth={1}
                strokeLinejoin="round"
                style={{
                  filter:
                    "drop-shadow(0 0 10px rgba(0, 0, 0, 0.1)) drop-shadow(0 0 20px rgba(0, 0, 0, 0.05))",
                }}
              >
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mergeStyles = (styles: Record<string, string | number>) => {
  return Object.entries(styles)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
};

interface SpinnerSvgProps {
  slots: { color: string; value: string }[];
}
const SpinnerSvg = ({ slots }: SpinnerSvgProps) => {
  const slot_count = slots.length;

  let svg = "";

  for (let i = 0; i < slot_count; i++) {
    const t = polarToCartesian({
      centerX: 50,
      centerY: 50,
      radius: 45,
      angleInDegrees: (i + 0.5) * (360 / slot_count),
    });

    // Slice
    const sliceArc = arcPath({
      x: 50,
      y: 50,
      radius: 5,
      endRadius: 50,
      startAngle: i * (360 / slot_count),
      endAngle: (i + 1) * (360 / slot_count),
    });

    const slice = `<path ${mergeStyles({
      d: sliceArc,
      fill: slots[i].color,
      stroke: "#ffffff",
      "stroke-width": "0.5",
    })} />`;

    const textRotation = `${1 * ((i + 0.5) * (360 / slot_count)) - 90} ${t.x},${t.y}`;
    const textValue = slots[i].value;
    const baseTextStyles = {
      "font-size": "6",
      x: t.x,
      y: t.y,
      "font-style": "bold",
      "alignment-baseline": "central",
      "text-anchor": "end",
      "transform ": `rotate(${textRotation})`,
    };

    const textShadow = `<text ${mergeStyles({
      ...baseTextStyles,
      fill: "#fffffff",
      stroke: "#ffffff",
      "stroke-width": "1",
      opacity: "0.7",
    })}>${textValue}</text>`;

    const text = `<text ${mergeStyles({
      ...baseTextStyles,
      fill: "#000000",
    })}>${textValue}</text>`;

    svg += slice + textShadow + text;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="spin"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
