// Custom cake options shared by the builder UI and the server-side price check.

export const CAKE_SIZES = ["500g", "1kg", "1.5kg"] as const;
export type CakeSize = (typeof CAKE_SIZES)[number];

export const CAKE_PRICES: Record<CakeSize, number> = {
  "500g": 550,
  "1kg": 950,
  "1.5kg": 1350,
};

export const CAKE_BASES = [
  { name: "Belgian Chocolate", color: "#4a2b1a" },
  { name: "Vanilla Bean", color: "#efe1c4" },
  { name: "Matcha Green Tea", color: "#c5d6a6" },
  { name: "Red Velvet", color: "#b04747" },
  { name: "Carrot Walnut", color: "#c68a4a" },
] as const;

export const CAKE_FROSTINGS = [
  "Cream Cheese",
  "Whipped Yogurt",
  "Dark Ganache",
  "Matcha Cream",
] as const;

export const CAKE_TOPPINGS = [
  "Fresh Berries",
  "Toasted Nuts",
  "Dark Chocolate Curls",
  "Edible Petals",
  "Matcha Dust",
] as const;

export type CakeConfig = {
  size: CakeSize;
  base: string;
  frosting: string;
  topping: string;
  message?: string;
};
