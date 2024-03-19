"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CirclePlus, MinusCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Control, type UseFieldArrayReturn } from "react-hook-form";
import { getRandomColor } from "./colors";
import { FortuneWheelForm } from "./fortune-wheel";

export const List = ({
  control,
  fieldArray,
}: {
  control: Control<FortuneWheelForm, any>;
  fieldArray: UseFieldArrayReturn<FortuneWheelForm, "options", "id">;
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const { fields, remove, append, insert, update } = fieldArray;

  const handleRemove = (index: number) => {
    // If last 2 item, don't remove
    if (fields.length === 2) {
      return;
    }
    remove(index);
  };

  const handleAdd = () => {
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
    <div className="relative flex h-full flex-col gap-2 rounded">
      <div className="flex h-full flex-col gap-1 overflow-y-auto rounded border p-3">
        {fields.map((field, index) => {
          return (
            <div className="flex gap-2" key={field.id}>
              <FormField
                control={control}
                name={`options.${index}.option`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
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

      <div className="mt-2">
        <Button
          className="w-full justify-between"
          type="button"
          onClick={handleAdd}
        >
          Add <CirclePlus size={18} />
        </Button>
      </div>
    </div>
  );
};
