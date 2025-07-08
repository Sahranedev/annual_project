import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiHelper from "../ApiHelper";

type WishlistItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  documentId: number;
};

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  add: (item: WishlistItem, token: string | null) => Promise<boolean>;
  remove: (id: number, token: string | null) => Promise<boolean>;
  fetch: (token: string | null) => Promise<void>;
  isFavorite: (id: number) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      add: async (item, token) => {
        if (!token) {
          set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (!existing) {
              return { items: [...state.items, item] };
            }
            return state;
          });
          return true;
        }

        try {
          set({ isLoading: true, error: null });

          const userResponse = await ApiHelper("users/me", "GET", null, token);

          if (userResponse.error) {
            set({
              error:
                userResponse.error.message ||
                "Erreur lors de la récupération du profil",
              isLoading: false,
            });
            return false;
          }

          const userId = userResponse.id;
          if (!userId) {
            set({ error: "ID utilisateur non disponible", isLoading: false });
            return false;
          }

          const wishlistsResponse = await ApiHelper(
            `wishlists?filters[user][id][$eq]=${userId}&populate=articles`,
            "GET",
            null,
            token
          );

          if (wishlistsResponse.error) {
            set({
              error:
                wishlistsResponse.error.message ||
                "Erreur lors de la récupération des wishlists",
              isLoading: false,
            });
            return false;
          }

          let wishlistId = null;
          let articleIds = [];

          if (wishlistsResponse.data && wishlistsResponse.data.length > 0) {
            const sortedWishlists = [...wishlistsResponse.data].sort((a, b) => {
              const dateA = new Date(
                a.createdAt || a.attributes?.createdAt || 0
              );
              const dateB = new Date(
                b.createdAt || b.attributes?.createdAt || 0
              );
              return dateB.getTime() - dateA.getTime();
            });

            const wishlist = sortedWishlists[0];
            wishlistId = wishlist.id;

            if (
              wishlist.attributes &&
              wishlist.attributes.articles &&
              wishlist.attributes.articles.data
            ) {
              articleIds = wishlist.attributes.articles.data.map(
                (article: { id: number }) => article.id
              );
            } else if (wishlist.articles && wishlist.articles.length > 0) {
              articleIds = wishlist.articles.map(
                (article: { id: number }) => article.id
              );
            }
          }

          if (!wishlistId) {
            const articleResponse = await ApiHelper(
              `articles/${item.id}`,
              "GET",
              null,
              token
            );

            if (articleResponse.error) {
              set((state) => ({
                items: [...state.items, item],
                isLoading: false,
                error: null,
              }));
              return true;
            }

            const newWishlistResponse = await ApiHelper(
              "wishlists",
              "POST",
              {
                data: {
                  user: userId,
                  articles: [item.id],
                },
              },
              token
            );

            if (newWishlistResponse.error) {
              const fallbackResponse = await ApiHelper(
                "wishlists",
                "POST",
                {
                  data: {
                    user: userId,
                  },
                },
                token
              );

              if (fallbackResponse.error) {
                set({
                  error:
                    fallbackResponse.error.message ||
                    "Erreur lors de la création de la wishlist",
                  isLoading: false,
                });
                return false;
              }

              set((state) => ({
                items: [...state.items, item],
                isLoading: false,
                error: null,
              }));
              return true;
            }

            set((state) => ({
              items: [...state.items, item],
              isLoading: false,
              error: null,
            }));

            return true;
          }

          if (!articleIds.includes(item.id)) {
            const articleResponse = await ApiHelper(
              `articles/${item.id}`,
              "GET",
              null,
              token
            );

            if (articleResponse.error) {
              set((state) => ({
                items: [...state.items, item],
                isLoading: false,
                error: null,
              }));
              return true;
            }

            articleIds.push(item.id);
          } else {
            set({ isLoading: false });
            return true;
          }

          const updateResponse = await ApiHelper(
            `wishlists/${wishlistId}`,
            "PUT",
            {
              data: {
                articles: articleIds,
              },
            },
            token
          );

          if (updateResponse.error) {
            set({
              error:
                updateResponse.error.message ||
                "Erreur lors de la mise à jour de la wishlist",
              isLoading: false,
            });
            return false;
          }

          set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (!existing) {
              return {
                items: [...state.items, item],
                isLoading: false,
                error: null,
              };
            }
            return { isLoading: false, error: null };
          });

          return true;
        } catch (err: unknown) {
          console.error("Erreur d'ajout à la wishlist:", err);
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Erreur lors de l'ajout à la liste de souhaits";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      remove: async (id, token) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        if (!token) return true;

        try {
          set({ isLoading: true, error: null });

          const userResponse = await ApiHelper("users/me", "GET", null, token);

          if (userResponse.error) {
            set({ isLoading: false });
            return true;
          }

          const userId = userResponse.id;
          if (!userId) {
            set({ isLoading: false });
            return true;
          }

          const wishlistsResponse = await ApiHelper(
            `wishlists?filters[user][id][$eq]=${userId}&populate=articles`,
            "GET",
            null,
            token
          );

          if (
            wishlistsResponse.error ||
            !wishlistsResponse.data ||
            wishlistsResponse.data.length === 0
          ) {
            set({ isLoading: false });
            return true;
          }

          const sortedWishlists = [...wishlistsResponse.data].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.attributes?.createdAt || 0);
            const dateB = new Date(b.createdAt || b.attributes?.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          });

          const wishlist = sortedWishlists[0];
          const wishlistId = wishlist.id;

          let currentArticles = [];

          if (
            wishlist.attributes &&
            wishlist.attributes.articles &&
            wishlist.attributes.articles.data
          ) {
            currentArticles = wishlist.attributes.articles.data;
          } else if (wishlist.articles && wishlist.articles.length > 0) {
            currentArticles = wishlist.articles;
          } else {
            set({ isLoading: false });
            return true;
          }

          const updatedArticleIds = currentArticles
            .map((article: { id: number }) => article.id)
            .filter((articleId: number) => articleId !== id);

          const updateResponse = await ApiHelper(
            `wishlists/${wishlistId}`,
            "PUT",
            {
              data: {
                articles: updatedArticleIds,
              },
            },
            token
          );

          if (updateResponse.error) {
            set({ isLoading: false });
            return true;
          }

          set({ isLoading: false });
          return true;
        } catch (err: unknown) {
          console.error("Erreur de suppression de la wishlist:", err);

          set({ isLoading: false });
          return true;
        }
      },

      fetch: async (token) => {
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          set({ isLoading: true, error: null });

          const userResponse = await ApiHelper("users/me", "GET", null, token);

          if (userResponse.error) {
            set({
              error:
                userResponse.error.message ||
                "Erreur lors de la récupération du profil",
              isLoading: false,
            });
            return;
          }

          const userId = userResponse.id;
          if (!userId) {
            set({ error: "ID utilisateur non disponible", isLoading: false });
            return;
          }

          const wishlistsResponse = await ApiHelper(
            `wishlists?filters[user][id][$eq]=${userId}&populate[articles][populate]=images`,
            "GET",
            null,
            token
          );

          if (wishlistsResponse.error) {
            set({
              error:
                wishlistsResponse.error.message ||
                "Erreur lors de la récupération des wishlists",
              isLoading: false,
            });
            return;
          }

          if (!wishlistsResponse.data || wishlistsResponse.data.length === 0) {
            set({ items: [], isLoading: false });
            return;
          }

          const sortedWishlists = [...wishlistsResponse.data].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.attributes?.createdAt || 0);
            const dateB = new Date(b.createdAt || b.attributes?.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          });

          const wishlist = sortedWishlists[0];

          let articles = [];

          if (
            wishlist.attributes &&
            wishlist.attributes.articles &&
            wishlist.attributes.articles.data
          ) {
            articles = wishlist.attributes.articles.data;
          } else if (wishlist.articles && wishlist.articles.length > 0) {
            articles = wishlist.articles;
          } else {
            set({ items: [], isLoading: false });
            return;
          }

          const fetchedItems: WishlistItem[] = [];

          for (const article of articles) {
            try {
              if (!article.attributes && !article.title) {
                continue;
              }

              const attributes = article.attributes || article;

              fetchedItems.push({
                id: article.id,
                title: attributes.title || "Article sans titre",
                price: attributes.price || 0,
                thumbnail: attributes.images?.data?.[0]?.attributes?.formats
                  ?.thumbnail?.url
                  ? `http://localhost:1337${attributes.images.data[0].attributes.formats.thumbnail.url}`
                  : "",
                documentId: attributes.documentId || 0,
              });
            } catch (err) {
              console.error(
                `Erreur lors de la récupération de l'article ${article.id}:`,
                err
              );
            }
          }

          set({
            items: fetchedItems,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          console.error("Erreur de récupération de la wishlist:", err);
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Erreur lors de la récupération de la liste de souhaits";
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      isFavorite: (id) => {
        return get().items.some((item) => item.id === id);
      },

      clear: () => set({ items: [], error: null }),
    }),
    { name: "wishlist-store" }
  )
);
