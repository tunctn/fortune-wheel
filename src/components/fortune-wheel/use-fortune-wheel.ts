"use client";

import { filterDegree } from "@/components/utils/filter-degree";
import $ from "jquery";
import { useRef, useState } from "react";
import { Slot } from "./types";

interface UseFortuneWheelProps {
  slots: Slot[];
  speed?: number;
  spinSpeed?: number;
  minDuration?: number;
  maxDuration?: number;

  onSpinTouchEdge: () => void;
  onSpinStart: () => void;
  onSpinEnd: (value: string) => void;
}

export const useFortuneWheel = ({
  slots,
  speed = 0,
  spinSpeed = 15,
  minDuration = 4000,
  maxDuration = 7000,
  onSpinStart,
  onSpinEnd,
  onSpinTouchEdge,
}: UseFortuneWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const degree = useRef(0);

  let spin = {
    slots: slots,
    speed: speed,
    spinSpeed: spinSpeed,
    stop: false,
    minDuration: minDuration,
    maxDuration: maxDuration,
    randomSpeed: 0,
  };
  const spinAnim = () => {
    if (spin.stop) return true;

    const deg = filterDegree(degree.current + spin.speed);
    const slotAmount = spin.slots.length;
    const p = 360 / slotAmount;
    const isTouchingEdge = deg % p < spin.speed;
    const isTouchingEdgeWithThreshold = isTouchingEdge && spin.speed > 0.5;

    if (isTouchingEdgeWithThreshold) {
      onSpinTouchEdge();
      const spinArrow = document.getElementById("spin-arrow");
      if (spinArrow) {
        spinArrow.style.transform = `rotate(5deg)`;
        setTimeout(() => {
          spinArrow.style.transform = `rotate(-5deg)`;

          setTimeout(() => {
            spinArrow.style.transform = `rotate(0deg)`;
          }, 20);
        }, 20);
      }
    }

    degree.current = deg;
    $("#spin").css("transform", `rotate(${deg}deg)`);
    window.requestAnimationFrame(spinAnim);
  };

  const spinStop = () => {
    spin.stop = true;

    let values = $("#spin").css("transform");
    values = values.split("(")[1];
    values = values.split(")")[0];

    const arrValues = values.split(",");
    const arr1 = Number(arrValues[1]);
    const arr0 = Number(arrValues[0]);

    const degree = Math.atan2(arr1, arr0) * (180 / Math.PI);
    const d = filterDegree(degree);
    const p = 360 / spin.slots.length;
    const slot = Math.floor((360 - d) / p);

    setIsSpinning(false);
    onSpinEnd(spin.slots[slot].value);
  };

  const spinStart = () => {
    onSpinStart();
    setIsSpinning(true);
    spin.stop = false;
    spinAnim();
    spin.randomSpeed = Math.random();

    $(spin).animate(
      { speed: spin.spinSpeed },
      0.15 * spin.minDuration,
      "easeInBack",
      function () {
        $(spin).animate(
          { speed: 0 },
          spin.minDuration +
            (spin.maxDuration - spin.minDuration) * spin.randomSpeed,
          "easeOutSine",
          function () {
            spinStop();
          },
        );
      },
    );
  };

  return {
    start: spinStart,
    stop: spinStop,
    isSpinning: isSpinning,
  };
};
