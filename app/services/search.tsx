export async function searchMetaphor(query: string, numResults: number = 3) {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, numResults }),
  });

  const data = await response.json();

  console.log(data);

  return data;
}
