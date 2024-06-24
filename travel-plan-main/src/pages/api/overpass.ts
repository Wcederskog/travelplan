import { NextApiRequest, NextApiResponse } from "next";

const fetchOverpassData = async (query: string) => {
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from Overpass API: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const data = await fetchOverpassData(query);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Overpass data:", error);
    return res.status(500).json({ error: error });
  }
};
