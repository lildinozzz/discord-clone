"use client";
import { CheckIcon, Copy, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState, useEffect } from "react";
import axios from "axios";

export const InviteModal = () => {
  const { onOpen, isOpen, type, onClose, data } = useModal();
  const origin = useOrigin();

  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  useEffect(() => {
    if (server?.inviteCode) {
      setInviteUrl(`${origin}/invite/${server.inviteCode}`);
    }
  }, [server, origin]);

  const handleCopyClick = () => {
    navigator?.clipboard?.writeText(inviteUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleGenerateNewLink = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", { server: data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteUrl(e.target.value);
  };

  if (!server?.inviteCode) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite Link
          </Label>

          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              onChange={handleInputChange}
              className="bg-zinc-300/50 border-0 focus:visible:ring-0 text-black focus:visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={handleCopyClick} size="icon">
              {isCopied && <CheckIcon className="w-4 h-4" />}
              {!isCopied && <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            onClick={handleGenerateNewLink}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
