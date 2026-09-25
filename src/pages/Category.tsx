import { useMemo, useState } from "react";
import { ArrowLeft, Box, ChevronDown, Filter, Search, Shirt, Flame, Sparkles, Cuboid, PenTool, Check, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { brl, Product, useStore } from "@/store";
import { Thumb } from "@/pages/Shop";

const icons = { Bordados: Shirt, Laser: Flame, Sublimação: Sparkles, "Impressão 3D": Cuboid, Papelaria: PenTool };

type Sort = "relevantes" | "menor" | "maior" | "vendidos" | "recentes";

const Category = () => {
  const { nome } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const category = decodeURIComponent(nome || "Todos");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("relevantes");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todas");

  const Icon = icons[category as keyof typeof icons] || Box;
  const base = products.filter((p) => p.active && (category === "Todos" || p.category === category));
  const list = useMemo(() => {
    const filtered = base.filter((p) => {
      const text = `${p.name} ${p.description}`.toLowerCase();
      if (query && !text.includes(query.toLowerCase())) return false;
      if (categoryFilter !== "todas" && p.category !== categoryFilter) return false;
      if (priceRange === "ate50" && p.price > 50) return false;
      if (priceRange === "50a100" && (p.price < 50 || p.price > 100)) return false;
      if (priceRange === "acima100" && p.price <= 100) return false;
      if (selected.includes("disponibilidade") && p.stock === 0) return false;
      if (selected.includes("novidades") && Date.now() - p.createdAt > 7 * 24 * 60 * 60 * 1000) return false;
      if (selected.includes("promoções") && p.price >= 50) return false;
      return true;
    });
    return [...filtered].sort((a, b) => sort === "menor" ? a.price - b.price : sort === "maior" ? b.price - a.price : sort === "recentes" ? b.createdAt - a.createdAt : sort === "vendidos" ? a.stock - b.stock : 0);
  }, [base, query, selected, sort]);

  const toggle = (value: string) => setSelected((current) => current.includes(value) ? current.filter((x) => x !== value) : [...current, value]);

  return (
    <main className="animate-fade-in px-5 pb-10 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <header className="flex items-center gap-3">
        <button aria-label="Voltar" onClick={() => navigate(-1)} className="rounded-full p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="h-5 w-5" /></button>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pinkSoft text-primary"><Icon className="h-6 w-6" /></div>
        <div><p className="text-xs font-bold uppercase text-primary">Categoria</p><h1 className="font-display text-2xl font-bold">{category}</h1></div>
      </header>
      <p className="mt-4 text-sm text-muted-foreground">{base.length} {base.length === 1 ? "produto disponível" : "produtos disponíveis"}</p>

      <div className="mt-5 flex items-center gap-2 rounded-full bg-card px-4 py-3 soft-shadow">
        <Search className="h-5 w-5 text-muted-foreground" /><label htmlFor="busca-categoria" className="sr-only">Buscar produtos</label><input id="busca-categoria" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar nesta categoria" className="w-full bg-transparent text-sm outline-none" />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Filter className="h-4 w-4" /> Filtros</button>
        <label className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">Ordenar<select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent outline-none"><option value="relevantes">Mais relevantes</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option><option value="vendidos">Mais vendidos</option><option value="recentes">Mais recentes</option></select><ChevronDown className="h-4 w-4" /></label>
      </div>
      {filtersOpen && <div className="mt-3 rounded-2xl border border-border bg-muted p-4"><p className="mb-3 text-sm font-bold">Filtrar produtos</p><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold">Preço<select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="todos">Todos os preços</option><option value="ate50">Até R$ 50</option><option value="50a100">De R$ 50 a R$ 100</option><option value="acima100">Acima de R$ 100</option></select></label><label className="text-xs font-semibold">Categoria<select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="todas">Todas as categorias</option>{Array.from(new Set(products.map((p) => p.category))).map((c) => <option key={c} value={c}>{c}</option>)}</select></label></div><div className="mt-3 grid grid-cols-2 gap-2">{[["disponibilidade", "Disponíveis"], ["novidades", "Novidades"], ["vendidos", "Mais vendidos"], ["promoções", "Promoções"]].map(([value, label]) => <button key={value} onClick={() => toggle(value)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected.includes(value) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>{selected.includes(value) && <Check className="h-3 w-3" />}{label}</button>)}</div></div>}

      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.map((p, i) => <article key={p.id} className="overflow-hidden rounded-3xl bg-card p-2"><div className="relative"><Thumb p={p} className="aspect-[4/5] rounded-2xl" /><span className="absolute right-2 top-2 rounded-full bg-card/90 p-2 text-primary"><Heart className="h-4 w-4" /></span></div><div className="px-2 pb-2 pt-3"><p className="min-h-10 text-sm font-bold leading-snug">{p.name}</p><p className="mt-1 font-display text-lg font-bold text-primary">{brl(p.price)}</p><button onClick={() => addToCart(p.id)} disabled={!p.stock} className="mt-2 w-full rounded-full bg-primary py-2 text-xs font-bold text-primary-foreground disabled:opacity-40">{p.stock ? "Adicionar" : "Esgotado"}</button></div></article>)}{list.length === 0 && <p className="col-span-2 py-12 text-center text-muted-foreground">Nenhum produto encontrado. Tente remover um filtro.</p>}</section>
    </main>
  );
};
export default Category;
