import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      return res.status(200).json({});
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500);
    }
  }
}
