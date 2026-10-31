import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer", "@prisma/client"],
};

export default nextConfig;

/* 
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // config options here
};

export default nextConfig;
*/


/* 
// TODO: if need
২) next.config (প্রয়োজন হলে)
Server-side renderToBuffer না করলেও, bundling issue এড়াতে:

// next.config.ts
const nextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig; 
*/