"use client";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface IEmojiPickerProps {
  onChange: (val: string) => void;
}

export interface IEmoji {
  id: string;
  name: string;
  native: string;
  colons: string;
  skin: number;
}

export const EmojiPricker = ({ onChange }: IEmojiPickerProps) => {
  const { resolvedTheme } = useTheme();
  const handleEmojiSelect = (emoji: IEmoji | null) => {
    if (emoji) {
      onChange(emoji.native);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 :dark-text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={handleEmojiSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
