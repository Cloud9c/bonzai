export async function findSimilar(url: string, numResults: number = 3) {
  const response = await fetch("/api/findSimilar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, numResults }),
  });

  const data = await response.json();

  return data;
}
