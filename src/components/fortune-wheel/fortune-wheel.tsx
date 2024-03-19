"use client";

import { Form } from "@/components/ui/form";

import { cn } from "@/lib/utils";
import Confetti from "react-dom-confetti";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { getRandomColor } from "./colors";
import { List } from "./list";
import { Spinner } from "./spinner";
import { Slot } from "./types";
import { useFortuneWheel } from "./use-fortune-wheel";

const DEFAULT_OPTIONS = [
  { option: "a24" },
  { option: "adidas" },
  { option: "adidas originals" },
  { option: "adobe" },
  { option: "airbnb" },
  { option: "amazon" },
  { option: "american express" },
  { option: "android" },
  { option: "apple" },
  { option: "arsenal" },
  { option: "audi" },
  { option: "bafta" },
  { option: "barilla" },
  { option: "bbc" },
  { option: "beats by dre" },
  { option: "bentley" },
  { option: "bing" },
  { option: "bmw" },
  { option: "borussia dortmund" },
  { option: "bose" },
  { option: "budweiser" },
  { option: "bugatti" },
  { option: "burberry" },
  { option: "burger king" },
  { option: "bvlgari" },
  { option: "calvin klein" },
  { option: "canon" },
  { option: "cat" },
  { option: "champions leauge" },
  { option: "chanel" },
  { option: "chatgpt" },
  { option: "chevrolet" },
  { option: "chick fil a" },
  { option: "chrome" },
  { option: "cisco" },
  { option: "citibank" },
  { option: "clubhouse" },
  { option: "cnn" },
  { option: "coca cola" },
  { option: "coca cola zero" },
  { option: "colgate" },
  { option: "converse" },
  { option: "crocs" },
  { option: "dallas cowboys" },
  { option: "dhl" },
  { option: "discord" },
  { option: "disney" },
  { option: "dolce & gabbana" },
  { option: "dominos" },
  { option: "doritos" },
  { option: "dove" },
  { option: "dropbox" },
  { option: "duolingo" },
  { option: "ea" },
  { option: "ebay" },
  { option: "efes malt" },
  { option: "espn" },
  { option: "euroleague" },
  { option: "facebook" },
  { option: "fc bayern munich" },
  { option: "fedex" },
  { option: "fenerbahce" },
  { option: "ferrari" },
  { option: "ford" },
  { option: "fortnite" },
  { option: "gatorade" },
  { option: "gilette" },
  { option: "github" },
  { option: "golden state warriors" },
  { option: "google" },
  { option: "gucci" },
  { option: "h&m" },
  { option: "harley davidson" },
  { option: "hbo" },
  { option: "heineken" },
  { option: "honda" },
  { option: "hp" },
  { option: "hsbc" },
  { option: "hyundai" },
  { option: "ibm" },
  { option: "ikea" },
  { option: "in n out" },
  { option: "instagram" },
  { option: "intel" },
  { option: "iphone" },
  { option: "jack daniels" },
  { option: "jeep" },
  { option: "kellogg's" },
  { option: "kfc" },
  { option: "kindle" },
  { option: "kitkat" },
  { option: "lakers" },
  { option: "lamborghini" },
  { option: "lego" },
  { option: "levi's" },
  { option: "lg" },
  { option: "linkedin" },
  { option: "liverpool" },
  { option: "lotus" },
  { option: "louis vuitton" },
  { option: "marvel" },
  { option: "mastercard" },
  { option: "mcdonald's" },
  { option: "mcdonalds" },
  { option: "mercedes" },
  { option: "mercedes-benz" },
  { option: "mgm studios" },
  { option: "microsoft" },
  { option: "milka" },
  { option: "minecrarft" },
  { option: "mini cooper" },
  { option: "mozilla firefox" },
  { option: "nba" },
  { option: "nescafe" },
  { option: "nestle" },
  { option: "netflix" },
  { option: "new york yankees" },
  { option: "nike" },
  { option: "nikon" },
  { option: "nintendo" },
  { option: "nokia" },
  { option: "nvidia" },
  { option: "off white" },
  { option: "olympus" },
  { option: "onlyfans" },
  { option: "oracle" },
  { option: "oreo" },
  { option: "oscars" },
  { option: "pepsi" },
  { option: "philips" },
  { option: "pirelli" },
  { option: "playstation" },
  { option: "porsche" },
  { option: "prada" },
  { option: "pringles" },
  { option: "puma" },
  { option: "quiksilver" },
  { option: "ralph lauren" },
  { option: "ray-ban" },
  { option: "real madrid" },
  { option: "red bull" },
  { option: "reebok" },
  { option: "rolex" },
  { option: "rolls-royce" },
  { option: "samsung" },
  { option: "skype" },
  { option: "sony" },
  { option: "spotify" },
  { option: "starbucks" },
  { option: "subway" },
  { option: "supreme" },
  { option: "swatch" },
  { option: "tag heuer" },
  { option: "target" },
  { option: "tesla" },
  { option: "tiffany & co." },
  { option: "tiktok" },
  { option: "tommy hilfiger" },
  { option: "toyota" },
  { option: "twitch" },
  { option: "twitter" },
  { option: "uber" },
  { option: "ups" },
  { option: "vans" },
  { option: "vercel" },
  { option: "versace" },
  { option: "virgin" },
  { option: "visa" },
  { option: "vogue" },
  { option: "volkswagen" },
  { option: "volvo" },
  { option: "walmart" },
  { option: "warner bros" },
  { option: "warner bros." },
  { option: "whatsapp" },
  { option: "windows" },
  { option: "xbox" },
  { option: "yahoo" },
  { option: "youtube" },
  { option: "zara" },
];

export type FortuneWheelForm = {
  options: {
    option: string;
    color: string;
  }[];
};

export const FortuneWheel = () => {
  const form = useForm<FortuneWheelForm>({
    defaultValues: {
      options: [
        { option: "McDonald's", color: getRandomColor() },
        { option: "Burger King", color: getRandomColor() },
      ],
    },
  });
  const fieldArray = useFieldArray({ control: form.control, name: "options" });

  const slots: Slot[] = form.watch("options").map((o) => {
    return { color: o.color, value: o.option };
  });

  const [lastWinner, setLastWinner] = useState<string>("");
  const { start, isSpinning } = useFortuneWheel({
    slots: slots,
    onSpinStart: () => {
      setLastWinner("");
    },
    onSpinEnd: (winner) => {
      setLastWinner(winner);
    },
  });
  const confetti = lastWinner !== "";
  return (
    <div className="flex h-[100dvh] w-full justify-between gap-2 overflow-hidden p-3">
      <div className="relative flex h-full flex-grow items-center justify-center py-4">
        <div className="flex h-full max-h-[500px] w-full ">
          <Spinner slots={slots} start={start} isSpinning={isSpinning} />

          <div className="absolute bottom-0 left-1/2 h-full w-[5px]">
            <Confetti
              active={confetti}
              config={{
                angle: 90,
                spread: 360,
                startVelocity: 40,
                elementCount: 70,
                dragFriction: 0.12,
                duration: 3000,
                stagger: 3,
                width: "10px",
                height: "10px",
                colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
              }}
            />
          </div>
          <div
            className={cn(
              "absolute bottom-2 left-1/2 -translate-x-1/2 text-center opacity-100 transition-all",
              {
                "opacity-0": isSpinning || lastWinner === "",
              },
            )}
          >
            <div className="text-xs font-semibold text-blue-600">Winner</div>
            <div className="-mt-1 font-semibold">{lastWinner}</div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form>
          <List control={form.control} fieldArray={fieldArray} />
        </form>
      </Form>
    </div>
  );
};
