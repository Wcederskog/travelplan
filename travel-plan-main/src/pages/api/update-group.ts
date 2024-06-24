import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    try {
      const { name, description, groupMembers, groupId } = req.body;
      const newMembers = await prisma.user.findMany({
        where: { email: { in: groupMembers } },
      });

      await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          name,
          description,
          users: {
            deleteMany: {},
            create: newMembers.map((newMember) => ({
              user: { connect: { id: newMember.id } },
              // userId: newMember.id,
            })),

            // connect: groupMembers.map((email: string) => ({ email: email })),
          },
        },
      });

      return res.status(200).json("Group created successfully");
    } catch (error) {
      console.error("Error creating group:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
