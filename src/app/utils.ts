/**
 * Formate un nombre en format de prix avec 2 décimales et symbole €
 * @param value - Le prix à formater
 * @returns Le prix formaté (ex: "42,99 €")
 */
export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Calcule le prix avec une réduction
 * @param price - Le prix original
 * @param discountPercentage - Le pourcentage de réduction
 * @returns Le prix après réduction
 */
export const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number
): number => {
  return price - (price * discountPercentage) / 100;
};
