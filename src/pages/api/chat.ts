import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { prompt, history = [], options = {} } = await req.body;

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "you are ai assistant",
      },
      ...history,
      {
        role: "user",
        content: prompt,
      },
    ],
    ...options,
  };

  const resp = await fetch("https://proxy.yunchat.club/v1/chat/completions", {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: any = await resp.json();
  // res.status(200).json({ ...json });
  res.status(200).json({...json.choices[0].message});
}
