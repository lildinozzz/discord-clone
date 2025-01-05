import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";

interface IChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
const ChannelIdPage = async ({ params }: IChannelIdPageProps) => {
  const profile = await currentProfile();
  const { serverId, channelId } = params;

  if (!profile) {
    return redirect("/sign-in");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === "TEXT" && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === "AUDIO" && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === "VIDEO" && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
