import { useState } from "react";
import { X, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { placeOrder } from "@/lib/server-fns";

export function CartDrawer() {
  const { items, open, setOpen, remove, setQty, total, clear, count } = useCart();
  const [placed, setPlaced] = useState<null | { id: string; total: number }>(null);
  const [checkout, setCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await placeOrder({
        data: {
          customer: form,
          items: items.map((i) => ({
            productId: i.productId,
            qty: i.qty,
            cakeConfig: i.cakeConfig,
          })),
        },
      });
      setPlaced({ id: result.orderNumber, total: result.total });
      clear();
      setCheckout(false);
      setForm({ name: "", phone: "", address: "" });
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Could not place your order. Please check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h3 className="font-display text-xl">Your basket</h3>
            <span className="text-sm text-muted-foreground">({count})</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 hover:bg-secondary"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {placed ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-8 w-8" />
            </div>
            <h4 className="font-display text-2xl">Order confirmed</h4>
            <p className="text-muted-foreground">
              Thanks! Your order <span className="font-medium text-foreground">#{placed.id}</span>{" "}
              is heading to the oven. We&apos;ll deliver it warm.
            </p>
            <p className="text-sm text-muted-foreground">Total paid: ₹{placed.total}</p>
            <button
              onClick={() => {
                setPlaced(null);
                setOpen(false);
              }}
              className="mt-4 rounded-full bg-primary px-6 py-3 text-primary-foreground"
            >
              Keep browsing
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="text-5xl">🥐</div>
            <p className="font-display text-xl">Your basket is empty</p>
            <p className="text-sm text-muted-foreground">
              Add something warm and wholesome from the menu.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3 rounded-2xl bg-card p-3 soft-shadow">
                  <img src={i.image} alt={i.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <p className="font-medium">{i.name}</p>
                      <button
                        onClick={() => remove(i.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">₹{i.price}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-border">
                        <button
                          onClick={() => setQty(i.id, i.qty - 1)}
                          className="p-1.5 hover:text-primary"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="p-1.5 hover:text-primary"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-medium">₹{i.price * i.qty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 bg-cream px-6 py-5">
              {!checkout ? (
                <>
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-display text-2xl">₹{total}</span>
                  </div>
                  <button
                    onClick={() => setCheckout(true)}
                    className="w-full rounded-full bg-primary py-4 font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    Checkout
                  </button>
                </>
              ) : (
                <form onSubmit={submit} className="space-y-3">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
                  />
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
                  />
                  <textarea
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Delivery address"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-primary py-4 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? "Placing order…" : `Place order · ₹${total}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckout(false)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    Back to basket
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
