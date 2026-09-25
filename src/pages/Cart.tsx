import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, CreditCard, Minus, Plus, QrCode, ShoppingBag } from "lucide-react";
import { brl, Order, useStore } from "@/store";
import { Thumb } from "./Shop";

const Cart = () => {
  const { cart, products, setQty, placeOrder } = useStore();
  const [step, setStep] = useState<"cart" | "checkout" | "paying">("cart");
  const [done, setDone] = useState<Order | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [payment, setPayment] = useState<"pix" | "cartao">("pix");

  const items = cart.flatMap((i) => {
    const product = products.find((p) => p.id === i.productId);
    return product ? [{ ...i, p: product }] : [];
  });
  const total = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  const valid = form.name.trim().length > 1 && form.phone.replace(/\D/g, "").length >= 10 && form.address.trim().length > 4;

  const pay = () => {
    setStep("paying");
    // Simula aprovação automática do pagamento
    setTimeout(() => {
      const order = placeOrder({ customer: form, items: items.map((i) => ({ name: i.p.name, price: i.p.price, qty: i.qty })), total, payment });
      setDone(order);
      setStep("cart");
    }, 1800);
  };

  if (done)
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-3 px-6 text-center animate-fade-in">
        <CheckCircle2 className="h-20 w-20 text-success" />
        <h1 className="font-display text-3xl font-bold">Pedido confirmado!</h1>
        <p className="text-muted-foreground">Pedido nº {done.id} • {brl(done.total)}</p>
        <p className="text-muted-foreground">Pagamento aprovado. Você receberá atualizações pelo WhatsApp.</p>
        <Link to="/" onClick={() => setDone(null)} className="mt-4 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Continuar comprando</Link>
      </div>
    );

  if (step === "paying")
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="font-semibold">Processando pagamento…</p>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h1 className="font-display text-2xl font-bold">Sua sacola está vazia</h1>
        <Link to="/" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Ver produtos</Link>
      </div>
    );

  const field = "w-full rounded-xl border bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring";

  return (
      <div className="px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] animate-fade-in">
        <p className="text-[10px] font-bold uppercase text-primary">Seu pedido</p>
      <h1 className="font-display text-3xl font-bold">{step === "cart" ? "Sacola" : "Finalizar compra"}</h1>

      {step === "cart" ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {items.map(({ p, qty }) => (
            <div key={p.id} className="flex gap-4 rounded-3xl bg-card p-4 soft-shadow">
              <Thumb p={p} className="h-24 w-24 shrink-0 rounded-2xl" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <span className="rounded-full bg-pinkSoft px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-primary">{p.category}</span>
                  <p className="mt-1 text-sm font-bold">{p.name}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{brl(p.price * qty)}</span>
                  <div className="flex items-center gap-3 rounded-full bg-secondary px-2 py-1">
                    <button onClick={() => setQty(p.id, qty - 1)} aria-label="Diminuir"><Minus className="h-4 w-4" /></button>
                    <span className="w-4 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(p.id, Math.min(p.stock, qty + 1))} aria-label="Aumentar"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-3 md:mx-auto md:max-w-lg">
          <input className={field} placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={field} placeholder="WhatsApp (com DDD)" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <textarea className={field} rows={3} placeholder="Endereço de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <p className="pt-2 font-semibold">Pagamento</p>
          <div className="grid grid-cols-2 gap-3">
            {([["pix", "Pix", QrCode], ["cartao", "Cartão", CreditCard]] as const).map(([k, l, Icon]) => (
              <button key={k} onClick={() => setPayment(k)} className={`flex flex-col items-center gap-1 rounded-xl border-2 py-4 font-semibold ${payment === k ? "border-primary text-primary" : "border-border"}`}>
                <Icon className="h-6 w-6" />{l}
              </button>
            ))}
          </div>
        </div>
      )}

        <div className="fixed inset-x-0 bottom-[88px] z-30 mx-auto max-w-md md:bottom-28 md:max-w-lg md:rounded-3xl rounded-t-3xl bg-card p-5 soft-shadow">
        <div className="mb-3 flex justify-between text-lg"><span>Total</span><span className="font-display font-bold">{brl(total)}</span></div>
        {step === "cart" ? (
          <button onClick={() => setStep("checkout")} className="w-full rounded-xl bg-primary py-4 font-semibold text-primary-foreground">Continuar</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setStep("cart")} className="rounded-xl bg-secondary px-5 font-semibold">Voltar</button>
            <button disabled={!valid} onClick={pay} className="flex-1 rounded-xl bg-primary py-4 font-semibold text-primary-foreground disabled:opacity-40">Pagar {brl(total)}</button>
          </div>
        )}
      </div>
      <div className="h-40" />
    </div>
  );
};
export default Cart;
