export type EmbeddingVector = number[];

export async function embedTexts(texts: string[]): Promise<EmbeddingVector[]> {
  if (texts.length === 0) return [];

  const url = process.env.EMBEDDING_API_URL;
  const key = process.env.EMBEDDING_API_KEY;
  const model = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";

  if (!url || !key) {
    return texts.map(() => new Array(1536).fill(0));
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input: texts }),
  });

  if (!response.ok) {
    throw new Error(`Embedding request failed: ${response.status}`);
  }

  const json = (await response.json()) as {
    data: Array<{ embedding: number[]; index: number }>;
  };
  return json.data.sort((a, b) => a.index - b.index).map((row) => row.embedding);
}
