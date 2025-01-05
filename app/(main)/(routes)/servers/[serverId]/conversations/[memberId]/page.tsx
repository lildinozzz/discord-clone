import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";

interface IMemberIdProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberId = async ({ params }: IMemberIdProps) => {
  const profile = await currentProfile();
  const { memberId, serverId } = await params;

  if (!profile) {
    redirect("/sign-in");
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
      <ChatMessages
        member={currentMember}
        name={currentMember.profile.name}
        chatId={currentMember.id}
        type="conversation"
        apiUrl="/api/direct-messages"
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id,
        }}
        paramKey="conversationId"
        paramValue={conversation.id}
      />
      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default MemberId;
