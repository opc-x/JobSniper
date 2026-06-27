import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JobSniper",
    short_name: "JobSniper",
    description: "精准狙击目标职位",
    start_url: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#2563eb",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
