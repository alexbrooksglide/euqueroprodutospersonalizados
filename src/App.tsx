import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/store";
import { Layout } from "@/components/Layout";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import Admin from "@/pages/Admin";
import { useState } from "react";
import { Splash } from "@/components/Splash";

const App = () => {
  const [splash, setSplash] = useState(true);
  return (
  <StoreProvider>
    {splash && <Splash onDone={() => setSplash(false)} />}
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Shop />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Shop />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StoreProvider>
  );
};

export default App;
