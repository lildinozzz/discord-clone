"use client";

import { TServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOutIcon,
  PlusCircle,
  Settings,
  TrashIcon,
  UserPlus,
  Users,
} from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { TModalType, useModal } from "@/hooks/use-modal-store";

interface IServerHeaderProps {
  server: TServerWithMembersWithProfiles;
  role?: MemberRole;
}
export const ServerHeader = ({ server, role }: IServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = role === MemberRole.MODERATOR || isAdmin;

  const handleOpenModal = (type: TModalType) => {
    onOpen(type, { server });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className="w-full text-md px-3 py-3 font-semibold 
     flex items-center border-neutral-200 dark:border-neutral-800 border-b-2 
     hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        >
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => handleOpenModal("invite")}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => handleOpenModal("editServer")}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Server Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => handleOpenModal("members")}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            onClick={() => handleOpenModal("createChannel")}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => handleOpenModal("deleteServer")}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Delete Server
            <TrashIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => handleOpenModal("leaveServer")}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Leave Server
            <LogOutIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
