import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ShoppingBag,
  Wheat,
  Leaf,
  Flame,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Star,
  Plus,
  Send,
} from "lucide-react";
import { CartProvider, useCart } from "@/lib/cart";
import { menu, categories, freshPickIds, type MenuItem } from "@/lib/menu";
import { CAKE_PRICES, CAKE_SIZES, CAKE_BASES, CAKE_FROSTINGS, CAKE_TOPPINGS } from "@/lib/cake";
import { submitEnquiry, type ProductRow } from "@/lib/server-fns";
import { CartDrawer } from "@/components/CartDrawer";
import heroBread from "@/assets/hero-bread.jpg";
import aboutImg from "@/assets/about-bakery.jpg";
import chocoDonut from "@/assets/chocolate-donut.jpg";
import matchaDonut from "@/assets/matcha-donut.jpg";
import berryWaffle from "@/assets/berry-waffle.jpg";
import lemonCake from "@/assets/lemon-cake.jpg";
import matchaCake from "@/assets/matcha-cake.jpg";

/* ---------- live menu (Supabase prices with static fallback) ---------- */

const MenuContext = createContext<MenuItem[]>(menu);
const useMenu = () => useContext(MenuContext);

function mergeMenu(products: ProductRow[] | null | undefined): MenuItem[] {
  if (!products || products.length === 0) return menu;
  const byId = new Map(products.map((p) => [p.id, p]));
  // The database is the source of truth for availability, names and prices;
  // images and categories stay with the bundled catalog.
  return menu
    .filter((m) => byId.has(m.id))
    .map((m) => {
      const p = byId.get(m.id)!;
      return { ...m, name: p.name, price: p.price, tag: p.tag ?? undefined };
    });
}

/* ---------- shell ---------- */

export function BakezillaSite({ products }: { products?: ProductRow[] | null }) {
  const liveMenu = useMemo(() => mergeMenu(products), [products]);
  return (
    <CartProvider>
      <MenuContext.Provider value={liveMenu}>
        <div className="min-h-screen bg-background text-foreground">
          <Nav />
          <Hero />
          <Marquee />
          <Features />
          <FreshPicks />
          <Menu />
          <BuildYourCake />
          <About />
          <Testimonials />
          <Gallery />
          <Contact />
          <Footer />
          <CartDrawer />
        </div>
      </MenuContext.Provider>
    </CartProvider>
  );
}

/* ---------- nav ---------- */

function Nav() {
  const { setOpen, count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    ["Menu", "menu"],
    ["Fresh Picks", "picks"],
    ["Build a Cake", "build"],
    ["About", "about"],
    ["Contact", "contact"],
  ];
  return (
    <header
      className={`fixed left-1/2 top-4 z-30 w-[min(96%,1180px)] -translate-x-1/2 rounded-full transition-all duration-500 ${scrolled ? "glass-card px-4 py-2.5" : "bg-transparent px-4 py-3"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Wheat className="h-4.5 w-4.5" strokeWidth={2.4} />
          </div>
          <div className="font-display text-lg leading-none">
            Bakezilla
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Bakery · Bread Shop
            </div>
          </div>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full px-4 py-2 text-sm text-foreground/80 transition hover:bg-secondary hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen(true)}
          className="relative flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm text-primary-foreground transition hover:opacity-90"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Basket</span>
          {count > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-cream px-1.5 text-[11px] font-semibold text-primary">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

/* ---------- hero ---------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-40">
      {/* organic blobs */}
      <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-sage/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-64 h-[28rem] w-[28rem] rounded-full bg-clay/25 blur-3xl" />

      {/* floating items with parallax */}
      <FloatItem
        src={chocoDonut}
        className="left-[6%] top-24 h-24 w-24 md:h-32 md:w-32"
        style={{ transform: `translateY(${y * 0.15}px)` }}
        anim="float-slow"
      />
      <FloatItem
        src={matchaDonut}
        className="right-[8%] top-40 h-28 w-28 md:h-36 md:w-36"
        style={{ transform: `translateY(${y * -0.12}px)` }}
        anim="float-med"
      />
      <FloatItem
        src={berryWaffle}
        className="left-[10%] bottom-16 h-28 w-28 md:h-40 md:w-40"
        style={{ transform: `translateY(${y * -0.08}px)` }}
        anim="float-slow"
      />
      <FloatItem
        src={lemonCake}
        className="right-[6%] bottom-24 h-24 w-24 md:h-32 md:w-32"
        style={{ transform: `translateY(${y * 0.1}px)` }}
        anim="float-med"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-sage-deep/20 bg-cream px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-sage-deep">
            <Leaf className="h-3.5 w-3.5" /> Wholesome since 2019
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] md:text-7xl">
            Good for you.
            <br />
            <span className="italic text-primary">Great</span> in every bite.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            No maida <span className="mx-2 text-sage-deep">•</span> Less sugar
            <span className="mx-2 text-sage-deep">•</span> Low calories
            <span className="mx-2 text-sage-deep">•</span> Wholesome ingredients
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Order Now
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-cream/60 px-7 py-4 font-medium text-primary transition hover:bg-cream"
            >
              View Menu
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-clay text-clay" />
              ))}
              <span className="ml-2 font-medium text-foreground">4.9</span>
            </div>
            <span>· 2,400+ happy bites</span>
          </div>
        </div>

        {/* rotating hero showcase (pseudo-3D) */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage/60 via-cream to-clay/30 blur-2xl" />
          <div className="absolute inset-4 rounded-full border border-dashed border-sage-deep/25 spin-slow" />
          <div
            className="absolute inset-10 rounded-full border border-dashed border-sage-deep/15 spin-slow"
            style={{ animationDirection: "reverse" }}
          />
          <div className="absolute inset-8 overflow-hidden rounded-full soft-shadow">
            <img
              src={heroBread}
              alt="Freshly baked artisan multigrain bread"
              width={1280}
              height={1280}
              className="h-full w-full scale-110 object-cover"
            />
          </div>
          {/* orbit chips */}
          <div className="absolute inset-0 spin-slow">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1 rounded-full bg-cream px-3 py-1 text-[11px] uppercase tracking-widest text-primary soft-shadow">
              No Maida
            </span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 rounded-full bg-cream px-3 py-1 text-[11px] uppercase tracking-widest text-primary soft-shadow">
              Fresh Daily
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 rounded-full bg-cream px-3 py-1 text-[11px] uppercase tracking-widest text-primary soft-shadow">
              Low Sugar
            </span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 rounded-full bg-cream px-3 py-1 text-[11px] uppercase tracking-widest text-primary soft-shadow">
              Whole Grain
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatItem({
  src,
  className,
  style,
  anim,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  anim: string;
}) {
  return (
    <div className={`pointer-events-none absolute hidden md:block ${className}`} style={style}>
      <div className={`h-full w-full ${anim}`}>
        <img
          src={src}
          alt=""
          className="h-full w-full rounded-full object-cover shadow-[0_30px_50px_-20px_rgba(60,45,20,0.35)]"
          loading="lazy"
        />
      </div>
    </div>
  );
}

/* ---------- marquee ---------- */

function Marquee() {
  const words = [
    "No Maida",
    "Less Sugar",
    "Low Calories",
    "Whole Grain",
    "Handcrafted",
    "Fresh Daily",
    "Local Sourced",
  ];
  return (
    <div className="border-y border-border/50 bg-cream py-5 overflow-hidden">
      <div className="flex whitespace-nowrap marquee-track">
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i} className="mx-8 font-display text-xl italic text-sage-deep">
            {w} <span className="ml-8 text-clay/60">✽</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- features ---------- */

function Features() {
  const items = [
    {
      icon: Wheat,
      title: "No Maida",
      desc: "Only whole grains, ancient flours and stone-milled goodness.",
    },
    {
      icon: Leaf,
      title: "Less Sugar",
      desc: "Naturally sweetened with jaggery, dates and ripe fruit.",
    },
    {
      icon: Flame,
      title: "Low Calories",
      desc: "Lighter recipes so every bite is guilt-free indulgence.",
    },
    {
      icon: Sparkles,
      title: "High Nutrition",
      desc: "Seeds, nuts, and superfoods baked in — nourishment first.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">Why Bakezilla</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Baked the way it should be.</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass-card lift rounded-3xl p-7">
            <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Icon className="h-5.5 w-5.5" strokeWidth={2.2} />
            </div>
            <h3 className="font-display text-2xl">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- fresh picks slider ---------- */

function FreshPicks() {
  const liveMenu = useMenu();
  const freshPicks = useMemo(
    () =>
      freshPickIds
        .map((id) => liveMenu.find((m) => m.id === id))
        .filter((m): m is MenuItem => Boolean(m)),
    [liveMenu],
  );
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardW = 320;

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % freshPicks.length), 4500);
    return () => clearInterval(t);
  }, [freshPicks.length]);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: idx * (cardW + 20), behavior: "smooth" });
  }, [idx]);

  return (
    <section id="picks" className="relative py-24">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">Out of the oven</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Today&apos;s fresh picks</h2>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => setIdx((i) => (i - 1 + freshPicks.length) % freshPicks.length)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-cream hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % freshPicks.length)}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="shrink-0" style={{ width: "calc(50vw - 640px)" }} />
        {freshPicks.map((p, i) => (
          <PickCard key={p.id} item={p} highlight={i === idx} />
        ))}
        <div className="shrink-0 pr-6" />
      </div>
    </section>
  );
}

function PickCard({ item, highlight }: { item: MenuItem; highlight: boolean }) {
  const { add } = useCart();
  return (
    <div
      className={`snap-start shrink-0 w-[300px] overflow-hidden rounded-3xl bg-card lift soft-shadow transition ${highlight ? "ring-2 ring-primary/40" : ""}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-sage-deep backdrop-blur">
          {item.category}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-5">
        <div>
          <p className="font-display text-lg leading-tight">{item.name}</p>
          <p className="text-sm text-muted-foreground">₹{item.price}</p>
        </div>
        <button
          onClick={() =>
            add({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              productId: item.id,
            })
          }
          className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105"
          aria-label={`Add ${item.name}`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/* ---------- menu ---------- */

function Menu() {
  const liveMenu = useMenu();
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const filtered = useMemo(
    () => (cat === "All" ? liveMenu : liveMenu.filter((m) => m.category === cat)),
    [cat, liveMenu],
  );
  const { add } = useCart();

  return (
    <section id="menu" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">Our Menu</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Everything wholesome, nothing dull.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-2 text-sm transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-cream hover:bg-secondary"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="lift group overflow-hidden rounded-3xl bg-card">
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                {item.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-sage-deep backdrop-blur">
                    {item.tag}
                  </span>
                )}
                <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-primary-foreground">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <h3 className="font-display text-xl leading-tight">{item.name}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">₹{item.price}</p>
                </div>
                <button
                  onClick={() =>
                    add({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      productId: item.id,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm text-primary-foreground transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- build your own cake ---------- */

function BuildYourCake() {
  const [size, setSize] = useState<(typeof CAKE_SIZES)[number]>("1kg");
  const [base, setBase] = useState("Belgian Chocolate");
  const [frosting, setFrosting] = useState("Cream Cheese");
  const [topping, setTopping] = useState("Fresh Berries");
  const [message, setMessage] = useState("");

  const bases = CAKE_BASES;
  const frostings = CAKE_FROSTINGS;
  const toppings = CAKE_TOPPINGS;
  const price = CAKE_PRICES[size];

  const { add, setOpen } = useCart();

  const addToCart = () => {
    add({
      id: `custom-${Date.now()}`,
      name: `Custom ${base} · ${size}`,
      price,
      image: matchaCake,
      cakeConfig: { size, base, frosting, topping, message: message || undefined },
    });
    setOpen(true);
  };

  const baseColor = bases.find((b) => b.name === base)?.color ?? "#c68a4a";

  return (
    <section id="build" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-sage/25 to-transparent" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {/* 3D-ish preview */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-full bg-cream soft-shadow" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-cream to-sage/40" />

          {/* cake stack */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative" style={{ perspective: 1200 }}>
              <div className="relative" style={{ transform: "rotateX(18deg)" }}>
                {/* plate */}
                <div className="absolute left-1/2 top-[86%] h-6 w-64 -translate-x-1/2 rounded-[50%] bg-foreground/10 blur-md" />
                {/* base tier */}
                <div
                  className="mx-auto h-32 w-56 rounded-b-3xl rounded-t-md transition-all duration-500"
                  style={{
                    background: baseColor,
                    boxShadow:
                      "inset 0 -20px 40px rgba(0,0,0,0.2), 0 20px 40px -20px rgba(0,0,0,0.35)",
                  }}
                />
                {/* frosting drip */}
                <div
                  className="absolute inset-x-0 top-0 mx-auto h-8 w-56 rounded-t-xl bg-cream"
                  style={{ boxShadow: "inset 0 -6px 12px rgba(0,0,0,0.08)" }}
                >
                  <div className="mx-auto flex w-56 justify-around">
                    {[...Array(8)].map((_, i) => (
                      <span key={i} className="mt-6 block h-3 w-4 rounded-b-full bg-cream" />
                    ))}
                  </div>
                </div>
                {/* topping */}
                <div className="absolute left-1/2 top-[-14px] -translate-x-1/2 text-2xl">
                  {topping === "Fresh Berries" && "🫐🍓🫐"}
                  {topping === "Toasted Nuts" && "🌰🌰🌰"}
                  {topping === "Dark Chocolate Curls" && "🍫🍫"}
                  {topping === "Edible Petals" && "🌸🌼🌸"}
                  {topping === "Matcha Dust" && "🍵✨"}
                </div>
              </div>
              <p className="mt-8 text-center font-display italic text-muted-foreground">
                {message ? `“${message}”` : "Your message here"}
              </p>
            </div>
          </div>
        </div>

        {/* controls */}
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">Interactive</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Build your own cake</h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Pick a base, frosting, and finishing touch. Watch it come together in real time.
          </p>

          <div className="mt-8 space-y-6">
            <Field label="Size">
              <div className="flex gap-2">
                {CAKE_SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-5 py-2.5 text-sm transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-cream hover:bg-secondary"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Base flavour">
              <div className="flex flex-wrap gap-2">
                {bases.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => setBase(b.name)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${base === b.name ? "border-primary bg-primary text-primary-foreground" : "border-border bg-cream hover:bg-secondary"}`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-border"
                      style={{ background: b.color }}
                    />
                    {b.name}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Frosting">
              <div className="flex flex-wrap gap-2">
                {frostings.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrosting(f)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${frosting === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-cream hover:bg-secondary"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Topping">
              <div className="flex flex-wrap gap-2">
                {toppings.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopping(t)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${topping === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-cream hover:bg-secondary"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Message on cake (optional)">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={30}
                placeholder="Happy birthday, Aarav!"
                className="w-full rounded-full border border-border bg-card px-5 py-3 outline-none focus:border-primary"
              />
            </Field>

            <div className="flex items-center justify-between gap-4 rounded-3xl bg-cream p-5 soft-shadow">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Total</p>
                <p className="font-display text-3xl">₹{price}</p>
              </div>
              <button
                onClick={addToCart}
                className="rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground transition hover:opacity-90"
              >
                Add to basket
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

/* ---------- about ---------- */

function About() {
  return (
    <section
      id="about"
      className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2"
    >
      <div className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-sage/40 blur-2xl" />
        <img
          src={aboutImg}
          alt="Inside the Bakezilla bakery"
          width={1280}
          height={960}
          loading="lazy"
          className="w-full rounded-[2rem] object-cover soft-shadow"
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">Our Story</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">A small oven with a big idea.</h2>
        <p className="mt-6 text-muted-foreground">
          Bakezilla started in a home kitchen with one belief — indulgence and wellness should share
          the same plate. Every loaf, slice and crumb is made without maida, refined sugar or
          shortcuts. Just slow ferments, honest grains and a whole lot of love.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            ["7yrs", "Baking daily"],
            ["100%", "Whole grains"],
            ["12+", "Fresh SKUs"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-cream p-4 text-center soft-shadow">
              <p className="font-display text-2xl text-primary">{k}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- testimonials ---------- */

function Testimonials() {
  const quotes = [
    {
      n: "Priya S.",
      r: "Regular since 2021",
      q: "The multigrain loaf changed my breakfast game. It actually keeps me full till lunch.",
    },
    {
      n: "Rahul M.",
      r: "Fitness coach",
      q: "I recommend Bakezilla to every client asking for a healthier bread. Zero maida, real ingredients.",
    },
    {
      n: "Neha K.",
      r: "Mom of two",
      q: "My kids don't even know the cookies are made with oats. Winning at parenting, quietly.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 max-w-xl">
        <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">Kind Words</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">
          Loved by people who actually read labels.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {quotes.map((t) => (
          <div key={t.n} className="glass-card lift rounded-3xl p-7">
            <div className="mb-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-clay text-clay" />
              ))}
            </div>
            <p className="font-display text-lg leading-snug">“{t.q}”</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary font-display text-primary-foreground">
                {t.n[0]}
              </div>
              <div>
                <p className="font-medium">{t.n}</p>
                <p className="text-xs text-muted-foreground">{t.r}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- gallery ---------- */

function Gallery() {
  const imgs = [
    menu[3].image,
    menu[10].image,
    menu[14].image,
    menu[6].image,
    menu[0].image,
    menu[19].image,
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">On the &apos;gram</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">@bakezilla</h2>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-cream px-5 py-2.5 text-sm hover:bg-secondary"
        >
          <Instagram className="h-4 w-4" /> Follow us
        </a>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {imgs.map((src, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl">
            <img
              src={src}
              alt="Bakezilla"
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 grid place-items-center bg-foreground/40 opacity-0 transition group-hover:opacity-100">
              <Instagram className="h-5 w-5 text-cream" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-6 overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground lg:grid-cols-[1.1fr_1fr]">
        <div className="p-10 md:p-14">
          <p className="text-xs uppercase tracking-[0.28em] text-cream/70">Come say hi</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Visit our bakery.</h2>
          <p className="mt-4 max-w-md text-cream/80">
            Fresh out of the oven every morning at 7 AM. Walk in for a warm loaf, or order online
            for delivery across the city.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4" /> 12 Baker Lane, Koramangala, Bengaluru 560095
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" /> hello@bakezilla.co
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="tel:+919876543210"
              className="rounded-full bg-cream px-6 py-3 font-medium text-primary hover:opacity-90"
            >
              Call to order
            </a>
            <a
              href="#menu"
              className="rounded-full border border-cream/30 px-6 py-3 font-medium hover:bg-cream/10"
            >
              Order online
            </a>
          </div>
          <EnquiryForm />
        </div>
        <div className="relative min-h-[320px] bg-sage/40">
          <iframe
            title="Bakezilla location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.6220%2C12.9250%2C77.6420%2C12.9450&layer=mapnik&marker=12.9350%2C77.6320"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

function EnquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await submitEnquiry({ data: form });
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Could not send your message. Please try again.",
      );
    }
  };

  const inputCls =
    "w-full rounded-xl border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-cream/50 outline-none transition focus:border-cream/60 focus:bg-cream/15";

  if (status === "sent") {
    return (
      <div className="mt-10 rounded-2xl border border-cream/25 bg-cream/10 p-6">
        <p className="font-display text-xl">Message sent 🌾</p>
        <p className="mt-1 text-sm text-cream/80">
          Thanks for writing in — we&apos;ll get back to you within a day.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm underline underline-offset-4 hover:text-cream"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10">
      <p className="text-xs uppercase tracking-[0.28em] text-cream/70">Or write to us</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name"
          className={inputCls}
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className={inputCls}
        />
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone (optional)"
          className={`${inputCls} sm:col-span-2`}
        />
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us about your order, event or question…"
          rows={3}
          className={`${inputCls} sm:col-span-2`}
        />
      </div>
      {error && <p className="mt-3 text-sm text-cream/90">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-medium text-primary transition hover:opacity-90 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

/* ---------- footer ---------- */

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-cream">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Wheat className="h-4.5 w-4.5" />
            </div>
            <p className="font-display text-lg">Bakezilla</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Wholesome bakes, no compromises.</p>
        </div>
        <FooterCol title="Shop" items={["Breads", "Cakes", "Donuts", "Waffles", "Savory"]} />
        <FooterCol
          title="Company"
          items={["About", "Our Story", "Careers", "Wholesale", "Press"]}
        />
        <FooterCol title="Support" items={["Delivery", "Returns", "FAQ", "Contact"]} />
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bakezilla. Baked fresh in Bengaluru.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="hover:text-primary">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
