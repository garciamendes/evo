// Reads and writes the study data as files in a private GitHub repository
// (DATA_REPO), using a fine-grained token limited to that repository.

type StoreConfig = { repo: string; token: string; api: string };

export function storeConfig(): StoreConfig | null {
  const repo = process.env.DATA_REPO;
  const token = process.env.DATA_GITHUB_TOKEN;
  if (!repo || !token) return null;
  return { repo, token, api: process.env.GITHUB_API_URL ?? "https://api.github.com" };
}

export class StoreError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function headers(config: StoreConfig) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config.token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function contentsUrl(config: StoreConfig, path: string) {
  return `${config.api}/repos/${config.repo}/contents/${path}`;
}

export type StoredFile = { content: string; sha: string };

export async function readFile(config: StoreConfig, path: string): Promise<StoredFile | null> {
  const res = await fetch(contentsUrl(config, path), { headers: headers(config), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new StoreError(`GitHub respondeu ${res.status} ao ler ${path}`, res.status);
  const data = (await res.json()) as { content: string; sha: string };
  return { content: Buffer.from(data.content, "base64").toString("utf8"), sha: data.sha };
}

/** Creates or replaces a file. Retries once if the file changed since it was read. */
export async function writeFile(config: StoreConfig, path: string, content: string, message: string): Promise<void> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const current = await readFile(config, path);
    const res = await fetch(contentsUrl(config, path), {
      method: "PUT",
      headers: { ...headers(config), "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, "utf8").toString("base64"),
        ...(current ? { sha: current.sha } : {}),
      }),
    });
    if (res.ok) return;
    if (res.status !== 409 && res.status !== 422) {
      throw new StoreError(`GitHub respondeu ${res.status} ao salvar ${path}`, res.status);
    }
  }
  throw new StoreError(`Conflito ao salvar ${path}`, 409);
}

export async function listDir(config: StoreConfig, path: string): Promise<string[]> {
  const res = await fetch(contentsUrl(config, path), { headers: headers(config), cache: "no-store" });
  if (res.status === 404) return [];
  if (!res.ok) throw new StoreError(`GitHub respondeu ${res.status} ao listar ${path}`, res.status);
  const data = (await res.json()) as { name: string; type: string }[];
  return data.filter((item) => item.type === "file").map((item) => item.name);
}
