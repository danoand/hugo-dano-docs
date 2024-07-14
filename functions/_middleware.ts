import cloudflareAccessPlugin from "@cloudflare/pages-plugin-cloudflare-access";

export const onRequest: PagesFunction = cloudflareAccessPlugin({
  domain: "https://hugo-dano-docs.pages.dev",
  aud: "342a6f122e7a7455223b380ac2a9dc5214f816c3e3c34cc3f80fd7525d38c4c9",
});