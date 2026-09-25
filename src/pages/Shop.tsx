import { useMemo, useState } from "react";
import { Bell, Box, ChevronRight, Cuboid, Flame, Heart, PenTool, Plus, Search, Shirt, ShoppingCart, Sparkles, X } from "lucide-react";
import { brl, Product, useStore } from "@/store";
import workshopHero from "@/assets/workshop-hero.jpg";
import { BrandLogo } from "@/components/BrandLogo";

export const Thumb = ({ p, className = "" }: { p: Product; className?: string }) => (
  <div className={`overflow-hidden bg-secondary ${className}`}>
    {p.image ? <img src={p.image} alt={p.name} loading="lazy" width={912} height={1136} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /> : null}
  </div>
);

const serviceIcons = { Bordados: Shirt, Laser: Flame, Sublimação: Sparkles, "Impressão 3D": Cuboid, Papelaria: PenTool };
const serviceStyles = ["bg-pinkSoft text-primary", "bg-purpleSoft text-accent", "bg-yellowSoft text-brandOrange", "bg-tealSoft text-brandTeal", "bg-muted text-brandPurple", "bg-pinkSoft text-primary"];

const DAY = 24 * 60 * 60 * 1000;
const isNewProduct = (p: Product) => Date.now() - p.createdAt < 7 * DAY;

const ProductCard = ({ p, i, onOpen, onAdd, novo = false }: { p: Product; i: number; onOpen: (p: Product) => void; onAdd: (p: Product) => void; novo?: boolean }) => (
  <article className="min-w-0 w-full">
    <div className="overflow-hidden rounded-3xl bg-card p-2 soft-shadow">
      <button onClick={() => onOpen(p)} className="block w-full text-left">
        <div className="relative">
          <Thumb p={p} className="aspect-[4/5] rounded-2xl" />
          <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${serviceStyles[i % serviceStyles.length]}`}>{p.category}</span>
          {novo && <span className="absolute bottom-2 left-2 rounded-full bg-secondary px-2.5 py-1 text-[9px] font-extrabold uppercase text-secondary-foreground">Novo</span>}
          <span className="absolute right-2 top-2 rounded-full bg-card/90 p-2 text-primary"><Heart className="h-4 w-4" /></span>
        </div>
        <div className="px-2 pb-2 pt-3">
          <p className="line-clamp-2 min-h-10 text-sm font-bold leading-snug text-foreground">{p.name}</p>
          <p className="mt-1 font-display text-lg font-extrabold text-primary">{brl(p.price)}</p>
        </div>
      </button>
      <div className="px-2 pb-2">
        <button disabled={p.stock === 0} onClick={() => onAdd(p)} className="flex w-full items-center justify-center gap-1 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40">
          {p.stock === 0 ? "Esgotado" : <><Plus className="h-4 w-4" /> Adicionar</>}
        </button>
      </div>
    </div>
  </article>
);

const Shop = () => {
  const { products, addToCart } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todos");
  const [open, setOpen] = useState<Product | null>(null);
  const [added, setAdded] = useState<string | null>(null);

  const visible = products.filter((p) => p.active);
  const cats = useMemo(() => ["Todos", ...Array.from(new Set(visible.map((p) => p.category)))], [visible]);
  const list = visible.filter((p) => (cat === "Todos" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  const novos = useMemo(() => visible.filter(isNewProduct), [visible]);
  const novoIds = useMemo(() => new Set(novos.map((p) => p.id)), [novos]);

  const add = (p: Product) => {
    addToCart(p.id);
    setAdded(p.name);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div className="animate-fade-in overflow-hidden">
      <header className="flex items-center justify-between px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
        <BrandLogo priority className="w-44 sm:w-48" />
        <div className="flex items-center gap-2">
          <button aria-label="Notificações" className="relative rounded-full p-2 text-brandPurple"><Bell className="h-5 w-5" /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" /></button>
          <button aria-label="Carrinho" className="relative rounded-full bg-pinkSoft p-2 text-primary"><ShoppingCart className="h-5 w-5" /></button>
        </div>
      </header>

      <main>
        <section className="px-5 md:mx-auto md:max-w-xl">
          <div className="flex items-center gap-2 rounded-full bg-card px-5 py-3.5 soft-shadow">
          <Search className="h-5 w-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="O que você procura?" className="w-full bg-transparent text-sm outline-none" />
          </div>
        </section>

        <section className="px-5 pt-4">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl md:aspect-[21/8] bg-pinkSoft brand-shadow">
            <img src={workshopHero} alt="Produtos personalizados em uma bancada criativa" width={1536} height={1024} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/10" />
            <div className="absolute inset-0 flex max-w-[68%] flex-col justify-center p-5 md:max-w-[50%] md:p-10 text-primary-foreground">
              <span className="mb-2 w-fit rounded-full bg-secondary px-3 py-1 text-[9px] font-extrabold uppercase text-secondary-foreground">Feito do seu jeito</span>
              <h1 className="font-display text-2xl font-extrabold leading-tight">Presentes que contam histórias</h1>
              <button onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })} className="mt-3 flex w-fit items-center gap-1 rounded-full bg-card px-4 py-2 text-xs font-bold text-primary">Ver produtos <ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        {novos.length > 0 && (
          <section className="pt-7">
            <div className="flex items-end justify-between px-5">
              <div><p className="text-[10px] font-bold uppercase text-primary">Produtos cadastrados recentemente</p><h2 className="font-display text-xl font-bold">Acabaram de chegar ✨</h2></div>
            </div>
            <div className="no-scrollbar flex gap-4 overflow-x-auto px-5 pb-2 pt-4">
              {novos.map((p, i) => (
                <div key={p.id} className="w-[48%] shrink-0 sm:w-44">
                  <ProductCard p={p} i={i} onOpen={setOpen} onAdd={add} novo />
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="categorias" className="scroll-mt-4 pt-7">
          <div className="flex items-end justify-between px-5">
            <div><p className="text-[10px] font-bold uppercase text-primary">O que fazemos</p><h2 className="font-display text-xl font-bold">Escolha uma técnica</h2></div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 py-4">
            {cats.map((c, index) => {
              const Icon = c === "Todos" ? Box : serviceIcons[c as keyof typeof serviceIcons] || Box;
              const style = serviceStyles[index % serviceStyles.length];
              return (
                <button key={c} onClick={() => setCat(c)} className={`flex w-[78px] shrink-0 flex-col items-center gap-2 text-center text-[10px] font-bold ${cat === c ? "text-primary" : "text-muted-foreground"}`}>
                  <span className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform ${cat === c ? "scale-105 bg-primary text-primary-foreground shadow-md" : style}`}><Icon className="h-7 w-7" /></span>
                  <span className="min-h-8 leading-tight">{c}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section id="produtos" className="scroll-mt-4 px-5 pt-3">
          <div className="mb-4 flex items-end justify-between">
            <div><p className="text-[10px] font-bold uppercase text-primary">Nossa vitrine</p><h2 className="font-display text-xl font-bold">Feitos para você</h2></div>
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">Ver todos <ChevronRight className="h-4 w-4" /></span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {list.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} onOpen={setOpen} onAdd={add} novo={novoIds.has(p.id)} />
            ))}
            {list.length === 0 && <p className="col-span-2 py-10 text-center text-muted-foreground">Nenhum produto encontrado.</p>}
          </div>
        </section>
      </main>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/50 md:items-center md:p-6" onClick={() => setOpen(null)}>
          <div className="mx-auto w-full max-w-md animate-fade-in overflow-hidden rounded-t-2xl bg-card md:rounded-3xl pb-[env(safe-area-inset-bottom)]" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Thumb p={open} className="aspect-[4/3] rounded-t-2xl" />
              <button onClick={() => setOpen(null)} className="absolute right-3 top-3 rounded-full bg-card p-2"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase text-primary">{open.category}</p>
              <h2 className="font-display text-2xl font-bold">{open.name}</h2>
              <p className="text-muted-foreground">{open.description}</p>
              <p className="text-sm text-muted-foreground">{open.stock > 0 ? `${open.stock} em estoque` : "Esgotado"}</p>
              <div className="flex items-center justify-between pt-2">
                 <span className="font-display text-xl font-bold">{brl(open.price)}</span>
                 <button disabled={open.stock === 0} onClick={() => { add(open); setOpen(null); }} className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-40">
                  Adicionar à sacola
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-8" />

      {added && (
        <div className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit animate-fade-in rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background">
          {added} adicionado ✓
        </div>
      )}
    </div>
  );
};
export default Shop;
