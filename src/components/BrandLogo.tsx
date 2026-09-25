import logo2 from "@/assets/eu-quero-logo2.png";
import transparentLogo from "@/assets/eu-quero-logo-transparent.png";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  transparent?: boolean;
};

export const BrandLogo = ({ className = "", priority = false, transparent = false }: BrandLogoProps) => (
  <img
    src={transparent ? transparentLogo : logo2}
    alt="EU QUERO — Personalizados que Encantam"
    width={1434}
    height={390}
    loading={priority ? "eager" : "lazy"}
    fetchPriority={priority ? "high" : "auto"}
    className={`h-auto object-contain ${className}`}
  />
);