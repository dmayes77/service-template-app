export type Tenant = {
  slug: string;
  name: string;
  branding: {
    primary: string;
    accent: string;
    text: string;
    logoUrl: string;
  };
};

export const TENANTS: Record<string, Tenant> = {
  acme: {
    slug: "acme",
    name: "ACME Detailing",
    branding: {
      primary: "#0ea5e9",
      accent: "#34d399",
      text: "#0b1220",
      logoUrl: "https://placehold.co/200x60?text=ACME",
    },
  },
  bravo: {
    slug: "bravo",
    name: "Bravo Motors",
    branding: {
      primary: "#8b5cf6",
      accent: "#f59e0b",
      text: "#0b1220",
      logoUrl: "https://placehold.co/200x60?text=BRAVO",
    },
  },
};
