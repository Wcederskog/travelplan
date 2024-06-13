import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { groupId } = req.query as { groupId: string | undefined };

      if (!groupId) {
        const destinations = await prisma.destination.findMany({
          where: {
            userId: req.headers["user_id"] as string,
            AND: { groupId: null },
          },
          include: { user: true },
        });
        res.status(200).json(destinations);
      } else {
        const destinations = await prisma.destination.findMany({
          where: { groupId: groupId },
          include: { user: true },
        });
        res.status(200).json(destinations);
      }
      res.status(200).json([]);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      res.status(500).json({ error: "Error fetching destinations" });
    } finally {
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
