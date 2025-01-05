import { Channel, ChannelType, Server } from "@prisma/client";
import { StringifiableRecord } from "query-string";
import { create } from "zustand";

export type TModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "createChannel"
  | "members"
  | "leaveServer"
  | "deleteServer"
  | "editChannel"
  | "deleteChannel"
  | "messageFile"
  | "deleteMessage";

interface IModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: StringifiableRecord;
}

interface IModalStore {
  type: TModalType | null;
  data: IModalData;
  isOpen: boolean;
  onOpen: (type: TModalType, data?: IModalData) => void;
  onClose: () => void;
}

export const useModal = create<IModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
