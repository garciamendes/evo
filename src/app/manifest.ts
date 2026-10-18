import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Study Hub",
    short_name: "Study Hub",
    description: "Sistema pessoal de estudos: programação, inglês e IA.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f8",
    theme_color: "#4f46e5",
    lang: "pt-BR",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
