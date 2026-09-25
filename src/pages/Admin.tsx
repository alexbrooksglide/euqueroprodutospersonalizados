import { useState } from "react";
import { LogOut, Pencil, Plus, Trash2, X } from "lucide-react";
import { brl, Order, Product, useStore } from "@/store";
import { Thumb } from "./Shop";
import { supabaseConfigured } from "@/lib/supabase";

// Senha provisória — será substituída pelo login do Supabase
const DEMO_PIN = "1234";

const empty: Product = { id: "", name: "", description: "", price: 0, category: "", image: "", stock: 0, active: true, createdAt: 0 };

const Admin = () => {
  const { isAdmin, setIsAdmin, products, saveProduct, deleteProduct, orders, setOrderStatus } = useStore();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [tab, setTab] = useState<"produtos" | "pedidos">("produtos");
  const [edit, setEdit] = useState<Product | null>(null);

  const field = "w-full rounded-xl border bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring";

  if (!isAdmin)
    return (
      <div className="flex min-h-[80vh] flex-col justify-center gap-3 px-6">
        <h1 className="font-display text-3xl font-bold">Área administrativa</h1>
        <p className="text-muted-foreground">Digite a senha para continuar (provisória: 1234).</p>
        {!supabaseConfigured && (
          <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
            Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para conectar este app ao Supabase.
          </div>
        )}
        <input className={field} type="password" inputMode="numeric" placeholder="Senha" value={pin} onChange={(e) => { setPin(e.target.value); setErr(false); }} />
        {err && <p className="text-sm text-destructive">Senha incorreta.</p>}
        <button type="button" onClick={() => (pin === DEMO_PIN ? setIsAdmin(true) : setErr(true))} className="rounded-xl bg-primary py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Entrar</button>
      </div>
    );

  const save = () => {
    if (!edit || !edit.name || edit.price <= 0) return;
    saveProduct({ ...edit, id: edit.id || String(Date.now()), category: edit.category || "Geral" });
    setEdit(null);
  };

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const next: Record<Order["status"], Order["status"] | null> = { pago: "enviado", enviado: "entregue", entregue: null };

  return (
    <div className="px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Admin</h1>
        <button onClick={() => setIsAdmin(false)} aria-label="Sair" className="rounded-full bg-secondary p-2"><LogOut className="h-5 w-5" /></button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-4 shadow-sm"><p className="text-xs text-muted-foreground">Pedidos</p><p className="font-display text-2xl font-bold">{orders.length}</p></div>
        <div className="rounded-2xl bg-card p-4 shadow-sm"><p className="text-xs text-muted-foreground">Faturamento</p><p className="font-display text-2xl font-bold">{brl(revenue)}</p></div>
      </div>

      <div className="mt-4 flex rounded-xl bg-secondary p-1">
        {(["produtos", "pedidos"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize ${tab === t ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{t}</button>
        ))}
      </div>

      {tab === "produtos" ? (
        <div className="mt-4 space-y-3">
          <button onClick={() => setEdit({ ...empty })} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary py-4 font-semibold text-primary"><Plus className="h-5 w-5" /> Novo produto</button>
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm">
              <Thumb p={p} className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name}{!p.active && <span className="ml-2 text-xs text-muted-foreground">(oculto)</span>}</p>
                <p className="text-xs text-muted-foreground">{brl(p.price)} • estoque {p.stock}</p>
              </div>
              <button onClick={() => setEdit(p)} aria-label="Editar" className="p-2"><Pencil className="h-5 w-5" /></button>
              <button onClick={() => confirm(`Excluir ${p.name}?`) && deleteProduct(p.id)} aria-label="Excluir" className="p-2 text-destructive"><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.length === 0 && <p className="py-10 text-center text-muted-foreground">Nenhum pedido ainda.</p>}
          {orders.map((o) => (
            <div key={o.id} className="space-y-1 rounded-2xl bg-card p-4 shadow-sm">
              <div className="flex justify-between"><span className="font-bold">#{o.id}</span><span className="font-bold">{brl(o.total)}</span></div>
              <p className="text-sm">{o.customer.name} • {o.customer.phone}</p>
              <p className="text-xs text-muted-foreground">{o.customer.address}</p>
              <p className="text-xs text-muted-foreground">{o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold capitalize text-success">{o.status} • {o.payment}</span>
                {next[o.status] && <button onClick={() => { const status = next[o.status]; if (status) setOrderStatus(o.id, status); }} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold capitalize text-primary-foreground">Marcar {next[o.status]}</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {edit && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/50 md:items-center md:p-6" onClick={() => setEdit(null)}>
          <div className="mx-auto max-h-[90vh] w-full max-w-md md:rounded-3xl space-y-3 overflow-y-auto rounded-t-3xl bg-card p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">{edit.id ? "Editar" : "Novo"} produto</h2>
              <button onClick={() => setEdit(null)}><X className="h-6 w-6" /></button>
            </div>
            <input className={field} placeholder="Nome" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            <textarea className={field} rows={2} placeholder="Descrição" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className={field} type="number" inputMode="decimal" step="0.01" placeholder="Preço" value={edit.price || ""} onChange={(e) => setEdit({ ...edit, price: parseFloat(e.target.value) || 0 })} />
              <input className={field} type="number" inputMode="numeric" placeholder="Estoque" value={edit.stock || ""} onChange={(e) => setEdit({ ...edit, stock: parseInt(e.target.value) || 0 })} />
            </div>
            <input className={field} placeholder="Categoria" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} />
            <input className={field} placeholder="Link da imagem" value={edit.image} onChange={(e) => setEdit({ ...edit, image: e.target.value })} />
            <label className="flex items-center justify-between rounded-xl border px-4 py-3">
              <span>Visível na loja</span>
              <input type="checkbox" className="h-5 w-5 accent-[hsl(var(--primary))]" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />
            </label>
            <button onClick={save} className="w-full rounded-xl bg-primary py-4 font-semibold text-primary-foreground">Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;
