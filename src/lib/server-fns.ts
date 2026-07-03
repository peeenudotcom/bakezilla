import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/server/supabase";
import { CAKE_PRICES, CAKE_SIZES } from "@/lib/cake";

// ---------- products ----------

export type ProductRow = {
  id: string;
  name: string;
  price: number;
  category: string;
  tag: string | null;
};

export const getProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProductRow[] | null> => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category, tag")
        .eq("active", true);
      if (error) throw error;
      return data;
    } catch (error) {
      // The static menu is the fallback — never let a DB hiccup break the page.
      console.error("getProducts failed", error);
      return null;
    }
  },
);

// ---------- checkout ----------

const cakeConfigSchema = z.object({
  size: z.enum(CAKE_SIZES),
  base: z.string().min(1).max(60),
  frosting: z.string().min(1).max(60),
  topping: z.string().min(1).max(60),
  message: z.string().max(60).optional(),
});

const orderInputSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(20)
      .regex(/^[+\d][\d\s-]{6,}$/, "Invalid phone number"),
    address: z.string().trim().min(10).max(600),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().max(40).optional(),
        qty: z.number().int().min(1).max(100),
        cakeConfig: cakeConfigSchema.optional(),
      }),
    )
    .min(1)
    .max(50),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export const placeOrder = createServerFn({ method: "POST" })
  .validator(orderInputSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();

    const standardItems = data.items.filter((i) => !i.cakeConfig);
    const customCakes = data.items.filter((i) => i.cakeConfig);

    if (standardItems.some((i) => !i.productId)) {
      throw new Error("Every item needs a product id or a cake configuration.");
    }

    // Prices always come from the database / server config — never from the client.
    const productIds = [...new Set(standardItems.map((i) => i.productId!))];
    let productsById = new Map<string, { name: string; price: number }>();
    if (productIds.length > 0) {
      const { data: products, error } = await supabase
        .from("products")
        .select("id, name, price")
        .in("id", productIds)
        .eq("active", true);
      if (error) throw new Error("Could not load products. Please try again.");
      productsById = new Map(products.map((p) => [p.id, { name: p.name, price: p.price }]));
      const missing = productIds.filter((id) => !productsById.has(id));
      if (missing.length > 0) {
        throw new Error(
          "Some items in your basket are no longer available. Please refresh and retry.",
        );
      }
    }

    const itemRows = data.items.map((item) => {
      if (item.cakeConfig) {
        const price = CAKE_PRICES[item.cakeConfig.size];
        return {
          product_id: null as string | null,
          name: `Custom ${item.cakeConfig.base} · ${item.cakeConfig.size}`,
          unit_price: price,
          qty: item.qty,
          line_total: price * item.qty,
          is_custom_cake: true,
          cake_config: item.cakeConfig,
        };
      }
      const product = productsById.get(item.productId!)!;
      return {
        product_id: item.productId!,
        name: product.name,
        unit_price: product.price,
        qty: item.qty,
        line_total: product.price * item.qty,
        is_custom_cake: false,
        cake_config: null,
      };
    });

    const total = itemRows.reduce((sum, row) => sum + row.line_total, 0);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: data.customer.name,
        phone: data.customer.phone,
        address: data.customer.address,
        total,
      })
      .select("id, order_number")
      .single();
    if (orderError || !order) {
      console.error("order insert failed", orderError);
      throw new Error("Could not place your order. Please try again.");
    }

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemRows.map((row) => ({ ...row, order_id: order.id })));
    if (itemsError) {
      console.error("order items insert failed", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error("Could not place your order. Please try again.");
    }

    if (customCakes.length > 0) {
      const { error: cakeError } = await supabase.from("cake_requests").insert(
        customCakes.map((item) => ({
          order_id: order.id,
          size: item.cakeConfig!.size,
          base: item.cakeConfig!.base,
          frosting: item.cakeConfig!.frosting,
          topping: item.cakeConfig!.topping,
          message: item.cakeConfig!.message ?? null,
          price: CAKE_PRICES[item.cakeConfig!.size] * item.qty,
        })),
      );
      // The order itself is already stored (cake details live in order_items too),
      // so a cake_requests failure is logged but doesn't fail the checkout.
      if (cakeError) console.error("cake request insert failed", cakeError);
    }

    return { orderNumber: order.order_number as string, total };
  });

// ---------- contact ----------

const enquiryInputSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200).optional().or(z.literal("")),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    message: z.string().trim().min(5).max(2000),
  })
  .refine((v) => (v.email && v.email.length > 0) || (v.phone && v.phone.length > 0), {
    message: "Please share an email or phone number so we can reply.",
  });

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator(enquiryInputSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("contact_enquiries").insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      message: data.message,
    });
    if (error) {
      console.error("enquiry insert failed", error);
      throw new Error("Could not send your message. Please try again.");
    }
    return { ok: true };
  });
