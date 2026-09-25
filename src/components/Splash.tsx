import { useEffect, useState } from "react";
import { Gift, Heart, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export const Splash = ({ onDone }: { onDone: () => void }) => {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1700);
    const t2 = setTimeout(onDone, 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const floaters = [
    { Icon: Heart, cls: "left-[12%] top-[16%] h-6 w-6 text-primary", d: "0.1s" },
    { Icon: Gift, cls: "right-[14%] top-[22%] h-8 w-8 text-accent", d: "0.25s" },
    { Icon: Sparkles, cls: "left-[18%] bottom-[24%] h-7 w-7 text-brandOrange", d: "0.4s" },
    { Icon: Heart, cls: "right-[20%] bottom-[18%] h-5 w-5 text-secondary", d: "0.55s" },
    { Icon: Heart, cls: "left-[46%] top-[10%] h-4 w-4 text-primary", d: "0.7s" },
  ];

  return (
    <div
      role="status"
      aria-label="Carregando EU QUERO"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`}
    >
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute right-8 top-1/3 h-16 w-16 rounded-full border-2 border-primary/20" />
      <div className="absolute bottom-1/3 left-6 h-10 w-10 rounded-2xl bg-accent/10 rotate-12" />

      {floaters.map(({ Icon, cls, d }, i) => (
        <Icon key={i} className={`splash-float absolute ${cls}`} style={{ animationDelay: d }} fill={Icon === Heart ? "currentColor" : "none"} />
      ))}

      <div className="relative flex w-full flex-col items-center px-8 text-center">
        <div className="splash-pop flex w-full max-w-[340px] items-center justify-center px-3 py-5">
          <BrandLogo priority transparent className="w-full drop-shadow-lg" />
        </div>
        <div className="splash-rise mt-8 flex gap-1.5" style={{ animationDelay: "0.5s" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};
