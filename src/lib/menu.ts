import multigrain from "@/assets/multigrain-loaf.jpg";
import flaxseed from "@/assets/flaxseed-bread.jpg";
import wheatSour from "@/assets/wheat-sourdough.jpg";
import chocoCake from "@/assets/chocolate-cake.jpg";
import blueberry from "@/assets/blueberry-cake.jpg";
import carrot from "@/assets/carrot-cake.jpg";
import matchaCake from "@/assets/matcha-cake.jpg";
import lemon from "@/assets/lemon-cake.jpg";
import chocoDonut from "@/assets/chocolate-donut.jpg";
import berryDonut from "@/assets/berry-donut.jpg";
import cinnamon from "@/assets/cinnamon-donut.jpg";
import matchaDonut from "@/assets/matcha-donut.jpg";
import pbDonut from "@/assets/pb-donut.jpg";
import bananaW from "@/assets/banana-waffle.jpg";
import berryW from "@/assets/berry-waffle.jpg";
import chocoW from "@/assets/choco-waffle.jpg";
import nuttyW from "@/assets/nutty-waffle.jpg";
import breadStick from "@/assets/bread-sticks.jpg";
import methiPuff from "@/assets/methi-puff.jpg";
import spinachM from "@/assets/spinach-muffin.jpg";
import oatsCookie from "@/assets/oats-cookies.jpg";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Breads" | "Cakes" | "Donuts" | "Waffles" | "Savory";
  tag?: string;
};

export const menu: MenuItem[] = [
  {
    id: "b1",
    name: "Multigrain Loaf",
    price: 190,
    image: multigrain,
    category: "Breads",
    tag: "Fresh daily",
  },
  {
    id: "b2",
    name: "Flaxseed Bread",
    price: 180,
    image: flaxseed,
    category: "Breads",
    tag: "Omega-3",
  },
  {
    id: "b3",
    name: "Whole Wheat Sourdough",
    price: 200,
    image: wheatSour,
    category: "Breads",
    tag: "48hr fermented",
  },
  {
    id: "c1",
    name: "Belgian Chocolate",
    price: 220,
    image: chocoCake,
    category: "Cakes",
    tag: "Bestseller",
  },
  { id: "c2", name: "Blueberry Yogurt", price: 210, image: blueberry, category: "Cakes" },
  { id: "c3", name: "Carrot Walnut", price: 210, image: carrot, category: "Cakes" },
  {
    id: "c4",
    name: "Matcha Green Tea",
    price: 220,
    image: matchaCake,
    category: "Cakes",
    tag: "New",
  },
  { id: "c5", name: "Lemon Poppy", price: 200, image: lemon, category: "Cakes" },
  { id: "d1", name: "Chocolate Fudge", price: 120, image: chocoDonut, category: "Donuts" },
  { id: "d2", name: "Berry Bliss", price: 120, image: berryDonut, category: "Donuts" },
  { id: "d3", name: "Cinnamon Spice", price: 110, image: cinnamon, category: "Donuts" },
  { id: "d4", name: "Matcha Glaze", price: 120, image: matchaDonut, category: "Donuts" },
  { id: "d5", name: "Peanut Butter Bliss", price: 120, image: pbDonut, category: "Donuts" },
  { id: "w1", name: "Banana Nut", price: 180, image: bananaW, category: "Waffles" },
  { id: "w2", name: "Berry Compote", price: 190, image: berryW, category: "Waffles" },
  { id: "w3", name: "Dark Chocolate", price: 190, image: chocoW, category: "Waffles" },
  { id: "w4", name: "Nutty Maple", price: 190, image: nuttyW, category: "Waffles" },
  {
    id: "s1",
    name: "Herb & Cheese Bread Sticks",
    price: 150,
    image: breadStick,
    category: "Savory",
  },
  { id: "s2", name: "Methi Matar Puff", price: 150, image: methiPuff, category: "Savory" },
  { id: "s3", name: "Spinach & Corn Muffin", price: 130, image: spinachM, category: "Savory" },
  { id: "s4", name: "Masala Oats Cookies", price: 120, image: oatsCookie, category: "Savory" },
];

export const categories = ["All", "Breads", "Cakes", "Donuts", "Waffles", "Savory"] as const;

export const freshPickIds = ["c1", "b1", "w2", "c4", "d2", "s4"];
