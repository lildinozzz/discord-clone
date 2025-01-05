import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface IInviteCodePageProps {
  params: { inviteCode: string };
}

const InviteCodePage = async ({ params }: IInviteCodePageProps) => {
  const profile = await currentProfile();
  const { inviteCode } = await params;

  if (!profile) {
    return redirect("/sign-in");
  }

  if (!inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <div>Hello Invite</div>;
};

export default InviteCodePage;
