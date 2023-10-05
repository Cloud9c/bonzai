import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { query, numResults } = await request.json();

  const res = await fetch("https://api.metaphor.systems/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.METAPHOR_API_KEY,
    } as HeadersInit,
    body: JSON.stringify({ query, numResults }),
  });

  const data = await res.json();

  return new NextResponse(JSON.stringify(data), {
    status: 200,
  });
}
