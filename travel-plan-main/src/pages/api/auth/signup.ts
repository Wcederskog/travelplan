import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { bcryptHashAsync } from "@/utils/bcryptUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, name, password, confirmPassword } = req.body;
      if (
        !email
          .toLowerCase()
          .match(
            /[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^_`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
          )
      ) {
        return res.status(400).json({ error: "Not a valid email" });
      }
      //   if (password !== confirmPassword) {
      //     return res.status(400).json({ error: "Passwords do not match" });
      //   }
      const existingEmail = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (existingEmail) {
        // email already exists
        return res.status(400).json({ error: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcryptHashAsync(
        password,
        parseInt(process.env.SALT_ROUNDS || "12")
      );

      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          name: name,
        },
      });

      res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  }
}
