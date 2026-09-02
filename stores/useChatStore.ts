import { create } from "zustand";

type ChatStore = {
  activeRoomId: string | null;
  setActiveRoomId: (roomId: string | null) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  activeRoomId: null,
  setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),
}));
