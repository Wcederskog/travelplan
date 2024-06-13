import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        description,
        mandatory,
        groupEvent,
        estimatedPrice,
        dateFrom,
        dateTo,
        destination,
        overpassData,
        groupId,
      } = req.body;

      try {
        const title = destination?.title ?? overpassData?.tags?.name;
        const lng = destination?.lng ?? overpassData?.lon;
        const lat = destination?.lat ?? overpassData?.lat;

        await prisma.destination.create({
          data: {
            description: description,
            title: title,
            mandatory: mandatory,
            groupEvent: groupEvent,
            price: estimatedPrice,
            dateFrom: dateFrom,
            dateTo: dateTo,
            lat: lat,
            lng: lng,
            group: !groupId ? undefined : { connect: { id: groupId } },
            user: { connect: { id: req.headers["user_id"] as string } },
          },
        });
        console.log("New destination created:");
        res.status(200).json("Destination created successfully");
      } catch (error) {
        console.error("Error creating destination:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } catch {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  }
}
