import { createFileRoute } from "@tanstack/react-router";
import { BakezillaSite } from "@/components/BakezillaSite";
import { getProducts } from "@/lib/server-fns";

export const Route = createFileRoute("/")({
  loader: () => getProducts(),
  component: Home,
});

function Home() {
  const products = Route.useLoaderData();
  return <BakezillaSite products={products} />;
}
