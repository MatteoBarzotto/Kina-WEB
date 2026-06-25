export type Realization = {
  id: string;
  category: string;
  categorySlug: string;
  investor: string;
  scope: string;
  image: string;
};

const installationPhoto = new URL("../assets/oat/gallery/oat-realization-1.png", import.meta.url).href;
const mechanicalPhoto = new URL("../assets/oat/gallery/oat-realization-2.png", import.meta.url).href;

export const realizationCategories = [
  { slug: "klimatyzacja", name: "Klimatyzacja" },
  { slug: "wentylacja", name: "Wentylacja i rekuperacja" },
  { slug: "instalacje-sanitarne", name: "Instalacje sanitarne" },
  { slug: "ogrzewanie", name: "Ogrzewanie" },
  { slug: "projekty-wyceny", name: "Projekty i wyceny" },
];

export const realizations: Realization[] = [
  {
    id: "klimatyzacja-domy-mieszkania",
    category: "Klimatyzacja",
    categorySlug: "klimatyzacja",
    investor: "Domy, mieszkania i lokale",
    scope: "Montaż klimatyzacji w domach, mieszkaniach oraz obiektach użyteczności publicznej.",
    image: installationPhoto,
  },
  {
    id: "wentylacja-rekuperacja",
    category: "Wentylacja i rekuperacja",
    categorySlug: "wentylacja",
    investor: "Budynki mieszkalne i użytkowe",
    scope: "Montaż wentylacji mechanicznej i systemów rekuperacji poprawiających komfort oraz jakość powietrza.",
    image: mechanicalPhoto,
  },
  {
    id: "woda-kanalizacja",
    category: "Instalacje sanitarne",
    categorySlug: "instalacje-sanitarne",
    investor: "Inwestycje prywatne i komercyjne",
    scope: "Projektowanie i wykonanie instalacji wody oraz kanalizacji zgodnie z obowiązującymi normami.",
    image: installationPhoto,
  },
  {
    id: "centralne-ogrzewanie",
    category: "Ogrzewanie",
    categorySlug: "ogrzewanie",
    investor: "Domy i obiekty usługowe",
    scope: "Montaż instalacji centralnego ogrzewania dopasowanej do potrzeb budynku i sposobu użytkowania.",
    image: mechanicalPhoto,
  },
  {
    id: "ogrzewanie-podlogowe",
    category: "Ogrzewanie",
    categorySlug: "ogrzewanie",
    investor: "Komfortowe wnętrza mieszkalne",
    scope: "Wykonanie ogrzewania podłogowego zapewniającego równomierne rozprowadzenie ciepła i oszczędność energii.",
    image: installationPhoto,
  },
  {
    id: "projekty-instalacji",
    category: "Projekty i wyceny",
    categorySlug: "projekty-wyceny",
    investor: "Klienci indywidualni, inwestorzy i przedsiębiorcy",
    scope: "Projekty instalacji sanitarnych oraz indywidualne wyceny dla klientów, inwestorów i przedsiębiorców.",
    image: mechanicalPhoto,
  },
];
