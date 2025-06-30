import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

type PromoCode = {
  code: string;
  discount: number;
};

interface CartState {
  items: CartItem[];
  promoCode: PromoCode | null;
  shippingCost: number;
  suggestedProducts: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  setShippingCost: (cost: number) => void;
  setSuggestedProducts: (products: CartItem[]) => void;
  clear: () => void;
  subtotal: () => number;
  total: () => number;
}
/* J'ai mis code promo en dur pour l'instant mais a voir pour utiliser les code promo que t'a fais sur Strapi Evan */
const PROMO_CODES: PromoCode[] = [
  { code: "WELCOME10", discount: 10 },
  { code: "SUMMER20", discount: 20 },
];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      shippingCost: 0,
      suggestedProducts: [],
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          return existing
            ? {
                items: state.items.map((i) =>
                  i.id === item.id
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                ),
              }
            : { items: [...state.items, item] };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      applyPromoCode: (code) => {
        const promoCode = PROMO_CODES.find(
          (promo) => promo.code.toLowerCase() === code.toLowerCase()
        );

        if (promoCode) {
          set({ promoCode });
          return true;
        }
        return false;
      },
      removePromoCode: () => set({ promoCode: null }),
      setShippingCost: (cost) => set({ shippingCost: cost }),
      setSuggestedProducts: (products) => set({ suggestedProducts: products }),
      clear: () => set({ items: [], promoCode: null, shippingCost: 0 }),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      total: () => {
        const subtotal = get().subtotal();
        const { promoCode } = get();
        const discount = promoCode ? (subtotal * promoCode.discount) / 100 : 0;
        return subtotal - discount + get().shippingCost;
      },
    }),
    { name: "cart-store" }
  )
);
