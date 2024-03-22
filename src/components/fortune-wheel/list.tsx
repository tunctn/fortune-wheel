"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CirclePlus, MinusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Control,
  useFormContext,
  type UseFieldArrayReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { getRandomColor } from "./colors";
import { FortuneWheelForm } from "./fortune-wheel";

export const List = ({
  control,
  fieldArray,
  isSpinning,
  withBorder = true,
  itemIdPrefix,
}: {
  control: Control<FortuneWheelForm, any>;
  fieldArray: UseFieldArrayReturn<FortuneWheelForm, "options", "id">;
  isSpinning: boolean;
  withBorder?: boolean;
  itemIdPrefix: string;
}) => {
  const context = useFormContext();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const { fields, remove, append, insert, update } = fieldArray;
  const values = context.getValues("options") as {
    option: string;
    color: string;
  }[];

  const focusTo = useCallback(
    (index: number) => {
      setTimeout(() => {
        const input = document.getElementById(
          `${itemIdPrefix}-fortunewheel-list_option-${index}`,
        ) as HTMLInputElement;

        setFocusedIndex(index);
        input.focus();
        input.setSelectionRange(0, input.value.length);
      }, 10);
    },
    [itemIdPrefix],
  );

  const handleRemove = useCallback(
    (index: number, source: "button" | "keypress") => {
      if (isSpinning) {
        toast.info(`Wait until the winner of this round is announced!`, {
          icon: "🏅",
        });
        return;
      }

      // If last 2 item, don't remove
      if (fields.length === 2) {
        if (source === "button") {
          toast.error(`You need at least 2 options to spin the wheel!`);
        }

        if (source === "keypress") {
          const firstOption = values[0].option.trim();
          const secondOption = values[1].option.trim();

          if (firstOption === "" || secondOption === "") {
            if (focusedIndex === 1) {
              focusTo(0);
              return;
            }
          }
        }

        return;
      }
      remove(index);
    },
    [remove, focusTo, fields, isSpinning, values, focusedIndex],
  );

  const handleAdd = useCallback(() => {
    if (isSpinning) {
      toast.info(`Wait until the winner of this round is announced!`, {
        icon: "🏅",
      });
      return;
    }
    append({ option: "", color: getRandomColor() });

    focusTo(values.length);
  }, [append, focusTo, isSpinning, values.length]);

  // Paste event
  useEffect(() => {
    if (focusedIndex === null) return;

    // Track paste event
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData === null) return;

      const text = e.clipboardData.getData("text").trim();
      const textArray = text.split("\n");

      textArray.reverse().forEach((text, index) => {
        if (index === 0) {
          // Update the focused item
          const o = fields[focusedIndex];
          update(focusedIndex, {
            ...o,
            option: text.trim(),
          });
          return;
        }

        // Insert new item starting from focusedIndex
        insert(focusedIndex, {
          option: text.trim(),
          color: getRandomColor(),
        });
      });
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [focusedIndex, fields, insert, update]);

  // Enter and delete key event
  useEffect(() => {
    // Track enter key event
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.code === "NumpadEnter" || e.code === "13") {
        e.preventDefault();

        if (focusedIndex === null) return;

        const value = values[focusedIndex];
        // Already added
        if (value.option.trim() === "") {
          return;
        }

        // Check if any empty field
        const emptyField = values.find((v) => v.option.trim() === "");
        if (emptyField) {
          const index = values.indexOf(emptyField);
          focusTo(index);
        } else {
          handleAdd();
        }
      }

      if (e.key === "Backspace") {
        if (focusedIndex === null) return;

        const value = values[focusedIndex];
        // Already added
        if (value.option.trim() === "") {
          handleRemove(focusedIndex, "keypress");

          // Focus to the previous item
          if (focusedIndex > 0) {
            focusTo(focusedIndex - 1);
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex, values, focusTo, handleAdd, handleRemove]);

  return (
    <div
      className={cn("relative flex h-full flex-col gap-0", {
        "rounded border": withBorder,
      })}
    >
      <div className="flex h-full flex-col gap-1 overflow-y-auto p-2">
        {fields.map((field, index) => {
          return (
            <div className="flex w-full gap-2" key={field.id}>
              <FormField
                control={control}
                name={`options.${index}.option`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id={`${itemIdPrefix}-fortunewheel-list_option-${index}`}
                        className="w-full"
                        disabled={isSpinning}
                        {...field}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                size="icon"
                type="button"
                variant="outline"
                className="aspect-square"
                onClick={() => handleRemove(index, "button")}
              >
                <MinusCircle size={18} />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="border-t p-2">
        <Button
          className="w-full justify-between"
          type="button"
          onClick={handleAdd}
        >
          Add another <CirclePlus size={18} />
        </Button>
      </div>
    </div>
  );
};
