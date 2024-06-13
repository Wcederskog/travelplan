import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Authenticate user
      const userId = req.headers["user_id"] as string;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const groups = await prisma.group.findMany({
        where: {
          users: {
            some: {
              userId: userId,
            },
          },
        },
        include: {
          admin: {
            select: {
              name: true,
            },
          },
          users: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          destinations: true,
        },
      });

      res.status(200).json(
        groups.map((group) => ({
          ...group,
          members: group.users.map((user) => ({ ...user.user })),
        }))
      );
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ error: "Error fetching groups" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
