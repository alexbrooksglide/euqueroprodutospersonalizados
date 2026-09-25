import { createContext, useContext, useState, ReactNode } from "react";
import embroideredCap from "@/assets/embroidered-cap.jpg";
import laserTumbler from "@/assets/laser-tumbler.jpg";
import sublimationMug from "@/assets/sublimation-mug.jpg";
import organizer3d from "@/assets/3d-organizer.jpg";
import personalizedNotebook from "@/assets/personalized-notebook.jpg";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  active: boolean;
  createdAt: number;
};

export type CartItem = { productId: string; qty: number };

export type Order = {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; address: string };
  items: { name: string; price: number; qty: number }[];
  total: number;
  payment: "pix" | "cartao";
  status: "pago" | "enviado" | "entregue";
};

const DAY = 24 * 60 * 60 * 1000;
const seed: Product[] = [
  { id: "1", name: "Boné personalizado bordado", description: "Boné personalizado com bordado do seu nome, logo ou desenho favorito.", price: 69.9, category: "Bordados", image: embroideredCap, stock: 12, active: true, createdAt: Date.now() - 30 * DAY },
  { id: "2", name: "Copo térmico personalizado", description: "Copo térmico com gravação a laser para presentear ou levar sua marca com você.", price: 89.9, category: "Laser", image: laserTumbler, stock: 8, active: true, createdAt: Date.now() - 21 * DAY },
  { id: "3", name: "Caneca personalizada com arte", description: "Caneca com estampa colorida e acabamento feito para transformar momentos em presente.", price: 39.9, category: "Sublimação", image: sublimationMug, stock: 18, active: true, createdAt: Date.now() - 14 * DAY },
  { id: "4", name: "Organizador de mesa 3D", description: "Organizador produzido em impressão 3D para deixar sua mesa mais prática e bonita.", price: 59.9, category: "Impressão 3D", image: organizer3d, stock: 10, active: true, createdAt: Date.now() - 2 * DAY },
  { id: "5", name: "Caderno personalizado", description: "Caderno com capa personalizada para anotar planos, ideias e histórias do seu jeito.", price: 44.9, category: "Papelaria", image: personalizedNotebook, stock: 20, active: true, createdAt: Date.now() - 1 * DAY }, 
];

type Store = {
  products: Product[];
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  setOrderStatus: (id: string, s: Order["status"]) => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
};

const Ctx = createContext<Store | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(seed);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const store: Store = {
    products,
    saveProduct: (p) =>
      setProducts((ps) =>
        ps.some((x) => x.id === p.id)
          ? ps.map((x) => (x.id === p.id ? p : x))
          : [{ ...p, createdAt: p.createdAt || Date.now() }, ...ps]
      ),
    deleteProduct: (id) => setProducts((ps) => ps.filter((p) => p.id !== id)),
    cart,
    addToCart: (id) =>
      setCart((c) => (c.some((i) => i.productId === id) ? c.map((i) => (i.productId === id ? { ...i, qty: i.qty + 1 } : i)) : [...c, { productId: id, qty: 1 }])),
    setQty: (id, qty) => setCart((c) => (qty <= 0 ? c.filter((i) => i.productId !== id) : c.map((i) => (i.productId === id ? { ...i, qty } : i)))),
    clearCart: () => setCart([]),
    orders,
    placeOrder: (o) => {
      const order: Order = { ...o, id: String(1000 + orders.length + 1), createdAt: new Date().toISOString(), status: "pago" };
      setOrders((os) => [order, ...os]);
      // baixa automática de estoque
      setProducts((ps) =>
        ps.map((p) => {
          const it = cart.find((c) => c.productId === p.id);
          return it ? { ...p, stock: Math.max(0, p.stock - it.qty) } : p;
        })
      );
      setCart([]);
      return order;
    },
    setOrderStatus: (id, s) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: s } : o))),
    isAdmin,
    setIsAdmin,
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
};

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore fora do provider");
  return c;
};

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
