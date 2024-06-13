import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, description, members } = req.body;
      const userId = req.headers["user_id"] as string;
      const creator = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!creator) {
        return res.status(404).json({ error: "User not found" });
      }

      const allMembers = [...members, creator.email];

      const memberConnections = allMembers.map((email: string) => ({
        user: { connect: { email } },
      }));

      const group = await prisma.group.create({
        data: {
          name,
          description,
          users: {
            create: memberConnections,
          },
          admin: { connect: { id: userId } },
        },
      });

      return res.status(201).json(group);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
