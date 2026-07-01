import { createFileRoute } from "@tanstack/react-router";
import { BakezillaSite } from "@/components/BakezillaSite";

export const Route = createFileRoute("/")({
  component: BakezillaSite,
});
