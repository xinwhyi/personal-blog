import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import postgres from "postgres";

export const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "allow",
});

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["mdx", "ts", "tsx"],
  async redirects() {
    if (!process.env.POSTGRES_URL) {
      return [];
    }

    let redirects = await sql`
      SELECT source, destination, permanent
      FROM redirects;
    `;

    return redirects.map(({ source, destination, permanent }) => ({
      source,
      destination,
      permanent: !!permanent,
    }));
  },
  // Note: Using the Rust compiler means we cannot use
  // rehype or remark plugins. If you need them, remove
  // the `experimental.mdxRs` flag.
  experimental: {
    mdxRs: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
