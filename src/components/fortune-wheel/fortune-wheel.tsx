"use client";

import { FortuneWheelStatsResponse } from "@/app/api/fortune-wheel/route";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import Confetti from "react-dom-confetti";
import { useFieldArray, useForm } from "react-hook-form";
import { Drawer } from "vaul";
import { Button } from "../ui/button";
import { getRandomColor } from "./colors";
import { List } from "./list";
import { Spinner } from "./spinner";
import { Slot } from "./types";
import { useFortuneWheel } from "./use-fortune-wheel";

export type FortuneWheelForm = {
  options: {
    option: string;
    color: string;
  }[];
};

const DEFAULT_VALUES = [
  { option: "McDonald's", color: getRandomColor() },
  { option: "Burger King", color: getRandomColor() },
];

const STATS_QUERY_KEY = "fortune-wheel:stats";

export const FortuneWheel = () => {
  const queryClient = useQueryClient();
  const stats = useQuery({
    queryKey: [STATS_QUERY_KEY],
    queryFn: async () => {
      const response = await fetch("/api/fortune-wheel");
      return (await response.json()) as FortuneWheelStatsResponse;
    },
  });

  const updateStatsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/fortune-wheel", {
        method: "POST",
      });
      return (await response.json()) as FortuneWheelStatsResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([STATS_QUERY_KEY], data);
    },
  });

  const form = useForm<FortuneWheelForm>({
    defaultValues: {
      options: DEFAULT_VALUES,
    },
  });
  const fieldArray = useFieldArray({ control: form.control, name: "options" });
  const slots: Slot[] = form
    .watch("options")
    .filter((o) => o.option !== "")
    .map((o) => {
      return { color: o.color, value: o.option };
    });

  const [canMakeSound, setCanMakeSound] = useState<boolean>(true);
  const wheel1Ref = useRef<HTMLAudioElement>(null);
  const wheel2Ref = useRef<HTMLAudioElement>(null);
  const wheel3Ref = useRef<HTMLAudioElement>(null);
  const wheel4Ref = useRef<HTMLAudioElement>(null);

  const confettiSound1Ref = useRef<HTMLAudioElement>(null);
  const confettiSound2Ref = useRef<HTMLAudioElement>(null);

  const [lastWinner, setLastWinner] = useState<string>("");

  const onSpinTouchEdge = () => {
    const sounds = [1, 2, 3, 4];
    const rand = sounds[Math.floor(Math.random() * sounds.length)];
    const audio = [wheel1Ref, wheel2Ref, wheel3Ref, wheel4Ref][rand - 1];
    if (canMakeSound) audio.current?.play();
  };

  const onSpinStart = () => {
    setLastWinner("");
    updateStatsMutation.mutate();
  };

  const onSpinEnd = (winner: string) => {
    setLastWinner(winner);
    if (canMakeSound) {
      confettiSound1Ref.current?.play();
      setTimeout(() => {
        confettiSound2Ref.current?.play();
      }, 200);
    }
  };

  const { start, isSpinning } = useFortuneWheel({
    slots: slots,
    onSpinTouchEdge,
    onSpinStart,
    onSpinEnd,
  });
  const confetti = lastWinner !== "";

  return (
    <Form {...form}>
      <form className="h-full w-full">
        <div className="flex h-[100dvh] w-full justify-between gap-2 overflow-hidden p-3">
          <Button
            className="absolute left-2 top-2 z-[1]"
            size="icon"
            variant="outline"
            onClick={() => setCanMakeSound((prev) => !prev)}
          >
            {canMakeSound ? <Volume2 /> : <VolumeX />}
          </Button>

          <div className="relative flex h-full flex-grow items-center  justify-center py-4">
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
                    colors: [
                      "#a864fd",
                      "#29cdff",
                      "#78ff44",
                      "#ff718d",
                      "#fdff6a",
                    ],
                  }}
                />
              </div>
              <div
                className={cn(
                  "absolute bottom-[50px] left-1/2 -translate-x-1/2 text-center opacity-100 transition-all lg:bottom-8",
                  { "opacity-0": isSpinning || lastWinner === "" },
                )}
              >
                <div className="text-xs font-semibold text-blue-600">
                  Winner
                </div>
                <div className="-mt-1 text-2xl font-semibold">{lastWinner}</div>
              </div>
            </div>
          </div>

          {canMakeSound && (
            <>
              <audio ref={confettiSound1Ref} src={"/audios/confetti.mp3"} />
              <audio ref={confettiSound2Ref} src={"/audios/confetti.mp3"} />
              <audio ref={wheel1Ref} src={`/audios/wheel-1.mp3`} />
              <audio ref={wheel2Ref} src={`/audios/wheel-2.mp3`} />
              <audio ref={wheel3Ref} src={`/audios/wheel-3.mp3`} />
              <audio ref={wheel4Ref} src={`/audios/wheel-4.mp3`} />
            </>
          )}

          <div className="fixed bottom-2 left-0 flex w-full items-center justify-center lg:hidden ">
            <Drawer.Root shouldScaleBackground>
              <Drawer.Trigger asChild>
                <Button className="w-full max-w-[300px]">New option</Button>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[96%] flex-col rounded-t-[10px] bg-zinc-100">
                  <div className="absolute left-0 top-0 h-full w-full flex-1 rounded-t-[10px] bg-white p-4">
                    <List
                      isSpinning={isSpinning}
                      control={form.control}
                      fieldArray={fieldArray}
                    />
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          </div>

          <div className="fixed right-2 top-2 flex flex-col items-end gap-1 lg:bottom-2 lg:left-2 lg:right-auto lg:top-auto lg:items-start ">
            <div
              className={cn(
                "rounded border bg-gray-50 p-2 text-sm font-semibold opacity-100 transition-all",
                {
                  "opacity-0": stats.isLoading,
                },
              )}
            >
              spun {stats.data?.total_spins} times {`<3`}
            </div>

            <div className="flex w-max gap-2 rounded border px-2 py-1">
              <div className="text-xs  text-black/50">
                <a
                  href="https://tunc.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600"
                >
                  tunc.co
                </a>
              </div>
              <div className="text-xs">/</div>
              <div className="text-xs  text-black/50">
                <a
                  href="https://github.com/tunctn/fortune-wheel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold "
                >
                  github
                </a>
              </div>
            </div>
          </div>

          <div className="hidden h-full lg:block ">
            <List
              isSpinning={isSpinning}
              control={form.control}
              fieldArray={fieldArray}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
