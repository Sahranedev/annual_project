export const getImageUrl = (file: any, base = process.env.STRAPI_URL) => {
  if (!file) return "/placeholder.jpg";

  /* Ce petit helper sert a gérer les cas ou le format de l'image uploadé ne permet pas a strapi de générer l'url des différents formats d'image */
  const url =
    file.formats?.large?.url ||
    file.formats?.medium?.url ||
    file.formats?.small?.url ||
    file.url;

  return `${base}${url}`;
};
