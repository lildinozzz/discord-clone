"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

type TMediaRoomProps = {
  chatId: string;
  video: boolean;
  audio: boolean;
};

export const MediaRoom = ({ chatId, video, audio }: TMediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );

        if (!response.ok) {
          console.error("Response status not 200");
          return;
        }

        const { token } = await response.json();

        setToken(token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (!token) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-5000 dark:text-zinc-400">Loading ...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
