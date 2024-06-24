import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const { groupId } = req.body;
      const userId = req.headers["user_id"] as string;

      await prisma.group.delete({
        where: {
          id: groupId,
          adminId: userId,
        },
      });

      return res.status(200).json("Group deleted successfully");
    } catch (error) {
      console.error("Error deleting group:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
