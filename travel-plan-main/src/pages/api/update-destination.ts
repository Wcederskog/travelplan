import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    try {
      const {
        description,
        mandatory,
        groupEvent,
        estimatedPrice,
        dateFrom,
        dateTo,
        id,
      } = req.body;

      const updatedDestination = await prisma.destination.update({
        where: {
          id: id,
          userId: req.headers["user_id"] as string,
        },
        data: {
          description: description,
          mandatory: mandatory,
          groupEvent: groupEvent,
          price: estimatedPrice,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.status(200).json(updatedDestination);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return res.status(500).json({ error: "Error fetching destinations" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
