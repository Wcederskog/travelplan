import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { bcryptCompareAsync } from "@/utils/bcryptUtils";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!existingUser) {
        return res.status(400).json({ error: "Wrong credentials" });
      }

      // Compare password
      const passwordMatches = await bcryptCompareAsync(
        password,
        existingUser.password
      );

      if (!passwordMatches) {
        return res.status(401).json({ error: "Wrong credentials" });
      }

      const tokenData = {
        email: existingUser.email,
        id: existingUser.id,
      };

      const accessToken = jwt.sign(
        tokenData,
        process.env.JWT_SECRET || "defaultSecret",
        {
          expiresIn: "7d",
          algorithm: "HS256",
        }
      );

      console.log("logged in");

      res.json({
        token: accessToken,
        name: existingUser.name,
        id: existingUser.id,
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500);
    }
  }
}
