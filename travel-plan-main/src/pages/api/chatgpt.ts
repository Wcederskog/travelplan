import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const schema = {
  type: "object",
  properties: {
    recommendations: {
      type: "array",
      description: "An array of recommendations",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The touristattractions title",
          },
          description: {
            type: "string",
            description:
              "An explanation for why this destination fit within the given parameters.",
          },
          lng: {
            type: "number",
            description: "The longitude of the tourist attraction",
          },
          lat: {
            type: "number",
            description: "The latitude of the tourist attraction",
          },
        },
        required: ["title", "description", "lon", "lat"],
      },
    },
  },
  required: ["recommendations"],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const formData = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  const prompt = `Print a list of some things to do or attractions to visit for ${
    formData.numberOfPeople
  } persons, when traveling to ${formData.selectedDestination}. 
        The price range should be between ${formData.priceRange[0]} and ${
    formData.priceRange[1]
  } dollars per person and the ages span from ${formData.ageRange[0]} to ${
    formData.ageRange[1]
  } years. ${
    formData.additionalInfo
      ? `Keep in mind that ${formData.additionalInfo}.`
      : ""
  } For each recommendation, provide the longitude and latitude.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      functions: [
        {
          name: "tourist_recommendations",
          description:
            "Select a title from the given list that accurately describe the given text.",
          parameters: schema,
        },
      ],
      function_call: { name: "tourist_recommendations" },
    });

    const result = JSON.parse(
      response.choices[0].message?.function_call?.arguments ?? ""
    ) as { title: string; explanation: string };
    return res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
  }
}
