"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CirclePlus, MinusCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Control, type UseFieldArrayReturn } from "react-hook-form";
import { toast } from "sonner";
import { getRandomColor } from "./colors";
import { FortuneWheelForm } from "./fortune-wheel";

export const List = ({
  control,
  fieldArray,
  isSpinning,
}: {
  control: Control<FortuneWheelForm, any>;
  fieldArray: UseFieldArrayReturn<FortuneWheelForm, "options", "id">;
  isSpinning: boolean;
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const { fields, remove, append, insert, update } = fieldArray;

  const handleRemove = (index: number) => {
    if (isSpinning) {
      toast.info(`Wait until the winner of this round is announced!`, {
        icon: "🏅",
      });
      return;
    }

    // If last 2 item, don't remove
    if (fields.length === 2) {
      return;
    }
    remove(index);
  };

  const handleAdd = () => {
    if (isSpinning) {
      toast.info(`Wait until the winner of this round is announced!`, {
        icon: "🏅",
      });
      return;
    }
    append({ option: "", color: getRandomColor() });
  };

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
  }, [focusedIndex]);

  return (
    <div className="relative flex h-full flex-col gap-0 rounded border">
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
                onClick={() => handleRemove(index)}
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
