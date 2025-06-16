import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-static";

const SITE_URL = "https://next-mdx-blog.vercel.app";

async function getNoteSlugs(dir: string) {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name === "page.mdx")
    .map((entry) => {
      const filePathRelativeToDir = path.join(entry.path, entry.name);
      return path.dirname(filePathRelativeToDir);
    })
    .map((slug) => slug.replace(/\\/g, "/"));
}

export default async function sitemap() {
  const notesDirectory = path.join(process.cwd(), "app", "2025");
  const slugs = await getNoteSlugs(notesDirectory);

  const notes = slugs.map((slug) => ({
    url: `${SITE_URL}/2025/${slug}`,
    lastModified: new Date().toISOString(),
  }));

  const routes = ["", "/work"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...notes];
}
