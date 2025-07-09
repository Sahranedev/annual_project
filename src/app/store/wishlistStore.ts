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
            `wishlists?filters[user][id][$eq]=${userId}&populate=products`,
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
          let productsIds = [];

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
              wishlist.attributes.products &&
              wishlist.attributes.products.data
            ) {
              productsIds = wishlist.attributes.products.data.map(
                (article: { id: number }) => article.id
              );
            } else if (wishlist.products && wishlist.products.length > 0) {
              productsIds = wishlist.products.map(
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
                  products: [item.id],
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

          if (!productsIds.includes(item.id)) {
            const articleResponse = await ApiHelper(
              `products/${item.id}`,
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

            productsIds.push(item.id);
          } else {
            set({ isLoading: false });
            return true;
          }

          const updateResponse = await ApiHelper(
            `wishlists/${wishlistId}`,
            "PUT",
            {
              data: {
                products: productsIds,
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
            `wishlists?filters[user][id][$eq]=${userId}&populate=products`,
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

          let currentProducts = [];

          if (
            wishlist.attributes &&
            wishlist.attributes.products &&
            wishlist.attributes.products.data
          ) {
            currentProducts = wishlist.attributes.products.data;
          } else if (wishlist.products && wishlist.products.length > 0) {
            currentProducts = wishlist.products;
          } else {
            set({ isLoading: false });
            return true;
          }

          const updatedProductsIds = currentProducts
            .map((product: { id: number }) => product.id)
            .filter((productId: number) => productId !== id);

          const updateResponse = await ApiHelper(
            `wishlists/${wishlistId}`,
            "PUT",
            {
              data: {
                products: updatedProductsIds,
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

          let products = [];

          if (
            wishlist.attributes &&
            wishlist.attributes.products &&
            wishlist.attributes.products.data
          ) {
            products = wishlist.attributes.products.data;
          } else if (wishlist.products && wishlist.products.length > 0) {
            products = wishlist.products;
          } else {
            set({ items: [], isLoading: false });
            return;
          }

          const fetchedItems: WishlistItem[] = [];

          for (const product of products) {
            try {
              if (!product.attributes && !product.title) {
                continue;
              }

              const attributes = product.attributes || product;

              fetchedItems.push({
                id: product.id,
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
                `Erreur lors de la récupération de l'article ${product.id}:`,
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
