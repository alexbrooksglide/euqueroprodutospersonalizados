import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Grid2X2, House, ShoppingBag, Settings } from "lucide-react";
import { useStore } from "@/store";

export const Layout = () => {
  const { cart } = useStore();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tab = ({ isActive }: { isActive: boolean }) =>
    `flex min-w-16 flex-col items-center gap-1 py-2 text-[10px] font-bold transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`;
  const goToCategories = () => {
    const scroll = () =>
      document.getElementById("categorias")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (pathname === "/") {
      scroll();
    } else {
      navigate("/");
      setTimeout(scroll, 150);
    }
  };
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-28 shadow-2xl md:max-w-3xl md:shadow-none lg:max-w-6xl">
      <Outlet />
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md justify-around rounded-t-3xl md:bottom-4 md:max-w-lg md:rounded-3xl bg-card/95 px-2 pt-2 soft-shadow backdrop-blur">
        <NavLink to="/" end className={tab}><House className="h-5 w-5" />Loja</NavLink>
        <button type="button" onClick={goToCategories} className="flex min-w-16 flex-col items-center gap-1 py-2 text-[10px] font-bold text-muted-foreground transition-colors"><Grid2X2 className="h-5 w-5" />Categorias</button>
        <NavLink to="/carrinho" className={tab}>
          <span className="relative">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{count}</span>
            )}
          </span>
          Carrinho
        </NavLink>
        <NavLink to="/admin" className={tab}><Settings className="h-5 w-5" />Admin</NavLink>
      </nav>
    </div>
  );
};
