"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import qs, { StringifiableRecord } from "query-string";
import * as z from "zod";
import { Plus, Send } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPricker } from "@/components/emoji-picker";

interface IChatInputProps {
  apiUrl: string;
  query: StringifiableRecord;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: IChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);

      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenMessageFileModal = () => {
    onOpen("messageFile", { apiUrl, query });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500
                             dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                    onClick={handleOpenMessageFileModal}
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none 
                    border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                  />
                  <div className="absolute top-7 right-[5rem]">
                    <EmojiPricker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                  <div className="absolute top-7 right-[3.5rem]">
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="absolute h-[24px] w-[24px] bg-zinc-500
                             dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                    >
                      <Send className="text-white dark:text-[#313338]" />
                    </button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
