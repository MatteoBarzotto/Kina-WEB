/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence
} from "motion/react";
import { 
  Wind, 
  Thermometer, 
  Zap, 
  ArrowRight, 
  Send,
  Wrench,
  ClipboardCheck,
  CalendarCheck,
  AlertTriangle,
  FileText,
  BookOpen,
  UserRound,
  Plus, 
  Minus,
  CheckCircle2,
  ArrowUpRight,
  ArrowUp,
  Settings
} from "lucide-react";
import { siteConfig } from "./site-config";
import { realizationCategories, realizations } from "./realizations-data";
import { InteractiveFlowField } from "./InteractiveFlowField";
import backgroundVideo from "../assets/3.mp4";
import oatLogo from "../assets/oat/oat-logo.png";
import auxLogo from "../assets/oat/partners/aux.png";
import hisenseLogo from "../assets/oat/partners/hisense.png";
import immergasLogo from "../assets/oat/partners/immergas.png";
import kaisaiLogo from "../assets/oat/partners/kaisai.png";
import kanLogo from "../assets/oat/partners/kan.png";
import klimorLogo from "../assets/oat/partners/klimor.jpg";
import panasonicLogo from "../assets/oat/partners/panasonic-wide.png";
import viessmannLogo from "../assets/oat/partners/viessmann.png";

// --- Components ---

const phoneHref = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `tel:${phone.trim().startsWith("+") ? "+" : "+48"}${digits}`;
};

const partnerLogos = [
  { name: "Panasonic", src: panasonicLogo },
  { name: "Hisense", src: hisenseLogo },
  { name: "Kaisai", src: kaisaiLogo },
  { name: "AUX", src: auxLogo },
  { name: "Immergas", src: immergasLogo },
  { name: "Klimor", src: klimorLogo },
  { name: "Viessmann", src: viessmannLogo },
  { name: "KAN", src: kanLogo },
];

const initialRealizationsLimit = 6;
const realizationsLoadStep = 6;
const backgroundVideoFadeMs = 1200;
const backgroundVideoFadeSeconds = backgroundVideoFadeMs / 1000;
const backgroundVideoStartOffset = 0.05;

const contactTopics = [
  "Zapytanie ofertowe",
  "Klimatyzacja",
  "Wentylacja / rekuperacja",
  "Woda-kanalizacja",
  "Pompa ciepła / kotłownia",
  "Ogrzewanie / podłogówka",
  "Projekt lub wycena instalacji",
];

const serviceDetails = [
  {
    id: "klimatyzacja",
    number: "01",
    title: "Klimatyzacja",
    icon: Wind,
    lead: "Montaż klimatyzacji w domach, mieszkaniach, biurach oraz obiektach użyteczności publicznej.",
    bullets: ["dobór urządzenia", "montaż jednostek", "estetyczne prowadzenie instalacji", "uruchomienie i instruktaż"],
    bestFor: "domy, mieszkania, biura, lokale usługowe",
  },
  {
    id: "wentylacja",
    number: "02",
    title: "Wentylacja i rekuperacja",
    icon: Zap,
    lead: "Systemy wentylacji i rekuperacji, które poprawiają jakość powietrza oraz pomagają ograniczać straty energii.",
    bullets: ["wentylacja mechaniczna", "rekuperacja", "rozprowadzenie kanałów", "uruchomienie i regulacja"],
    bestFor: "domy, biura, obiekty użytkowe",
  },
  {
    id: "wod-kan",
    number: "03",
    title: "Instalacje wodno-kanalizacyjne",
    icon: Wrench,
    lead: "Kompleksowe systemy wodno-kanalizacyjne wykonywane zgodnie z normami i wymaganiami konkretnego obiektu.",
    bullets: ["instalacje wody", "kanalizacja", "biały montaż", "modernizacje i nowe inwestycje"],
    bestFor: "domy, mieszkania, lokale, inwestycje",
  },
  {
    id: "ogrzewanie",
    number: "04",
    title: "Pompy ciepła i ogrzewanie",
    icon: Thermometer,
    lead: "Montaż pomp ciepła, centralnego ogrzewania oraz kotłowni dopasowanych do potrzeb użytkownika i parametrów budynku.",
    bullets: ["pompy ciepła", "centralne ogrzewanie", "kotłownie gazowe, węglowe i inne", "pomoc przy dofinansowaniu"],
    bestFor: "budynki mieszkalne i usługowe",
  },
  {
    id: "podlogowka",
    number: "05",
    title: "Ogrzewanie podłogowe",
    icon: Settings,
    lead: "Nowoczesna podłogówka zapewniająca równomierne rozprowadzenie ciepła i komfort w każdym pomieszczeniu.",
    bullets: ["rozplanowanie pętli", "rozdzielacze", "próby szczelności", "przygotowanie pod wykończenie"],
    bestFor: "domy, mieszkania, nowe inwestycje",
  },
  {
    id: "projekty-wyceny",
    number: "06",
    title: "Projekty i wyceny",
    icon: ClipboardCheck,
    lead: "Indywidualne projekty i wyceny instalacji sanitarnych dla klientów prywatnych, inwestorów oraz przedsiębiorców.",
    bullets: ["analiza potrzeb", "dobór zakresu", "wycena materiałów i pracy", "koordynacja realizacji"],
    bestFor: "klienci indywidualni, inwestorzy, firmy",
  },
];

const offerScopeItems = [
  "Montaż pomp ciepła oraz pomoc w uzyskaniu dofinansowania",
  "Montaż klimatyzacji w domach, mieszkaniach oraz wszelkich obiektach użyteczności publicznej",
  "Montaż wentylacji i rekuperacji",
  "Montaż instalacji wody i kanalizacji",
  "Montaż instalacji centralnego ogrzewania",
  "Wykonanie ogrzewania podłogowego",
  "Wykonanie kotłowni gazowej, węglowej oraz każdego innego rodzaju",
  "Projekty instalacji sanitarnych",
  "Wyceny instalacji sanitarnych indywidualne dla klientów, a także kompleksowe dla inwestorów oraz przedsiębiorców",
];

const aboutSegments = [
  {
    title: "Dla Domów",
    subtitle: "Komfort i efektywność energetyczna",
    text: "Zapewniamy instalację klimatyzacji, wentylacji i nowoczesnych systemów ogrzewania. Rozwiązania dopasowujemy do indywidualnych potrzeb domowników, komfortu termicznego i oszczędności energii.",
  },
  {
    title: "Dla Biur",
    subtitle: "Produktywność i komfort pracowników",
    text: "Projektujemy systemy klimatyzacyjne i wentylacyjne tak, aby poprawiały jakość powietrza, stabilizowały warunki pracy i wspierały codzienny komfort zespołu.",
  },
  {
    title: "Dla Przemysłu",
    subtitle: "Skuteczność i optymalizacja energetyczna",
    text: "Dobieramy rozwiązania grzewcze, klimatyzacyjne i wentylacyjne do specyfiki obiektu, ciągłości pracy oraz wymagań energetycznych inwestycji.",
  },
];

const aboutStrengths = [
  "Doświadczenie i fachowość zespołu z wiedzą branżową",
  "Indywidualne podejście do każdego projektu",
  "Rozwiązania wspierające zrównoważony rozwój i oszczędność energii",
  "Wsparcie techniczne i serwisowe po instalacji",
];

const processSteps = [
  {
    title: "Kontakt i rozpoznanie",
    text: "Zbieramy podstawowe informacje o obiekcie, oczekiwaniach, lokalizacji i zakresie prac.",
  },
  {
    title: "Rozpoznanie obiektu",
    text: "Sprawdzamy warunki montażu, układ pomieszczeń, trasy instalacji i wymagania techniczne.",
  },
  {
    title: "Projekt i dobór zakresu",
    text: "Dobieramy wariant instalacji, materiały i rozwiązania do budżetu oraz sposobu użytkowania budynku.",
  },
  {
    title: "Wycena i harmonogram",
    text: "Przygotowujemy ofertę, ustalamy termin realizacji i wymagania po stronie inwestora.",
  },
  {
    title: "Montaż i uruchomienie",
    text: "Realizujemy instalację, wykonujemy próby, uruchamiamy system i przekazujemy użytkownikowi najważniejsze informacje.",
  },
  {
    title: "Serwis i opieka",
    text: "Zapewniamy przeglądy gwarancyjne i pogwarancyjne, diagnostykę oraz obsługę eksploatacyjną.",
  },
];

const serviceResponseItems = [
  "Wsparcie techniczne i posprzedażowe po wykonaniu instalacji",
  "Kontrola działania klimatyzacji, wentylacji i ogrzewania",
  "Pomoc przy modernizacji istniejących instalacji sanitarnych",
  "Uzgodnienie dalszych prac, rozbudów i etapowania inwestycji",
  "Kontakt jednym kanałem: biuro@oatinstalacje.pl oraz telefon 665 610 051",
];

const guidePosts = [
  {
    id: "przeglad-klimatyzacji",
    category: "Serwis",
    readTime: "4 min",
    title: "Kiedy zrobić przegląd klimatyzacji?",
    excerpt: "Najlepiej przed sezonem chłodzenia i po okresie intensywnej pracy. Regularna kontrola pomaga utrzymać wydajność, higienę i komfort użytkowania.",
    linkLabel: "Czytaj więcej",
    content: [
      "Przegląd klimatyzacji warto zaplanować zanim urządzenie zacznie pracować codziennie przez wiele godzin. Pozwala to sprawdzić filtry, odpływ skroplin, przepływ powietrza i podstawowe parametry pracy.",
      "W domach zwykle wystarcza kontrola sezonowa, ale w biurach i lokalach usługowych częstotliwość warto dopasować do intensywności użytkowania. Im większe obciążenie, tym większe znaczenie ma regularność.",
      "Dobrze utrzymana klimatyzacja pracuje ciszej, wydajniej i higieniczniej. To też prosty sposób na ograniczenie ryzyka awarii w czasie największych upałów.",
    ],
    checklist: ["kontrola filtrów i wymienników", "dezynfekcja jednostki", "sprawdzenie odpływu skroplin", "pomiar podstawowych parametrów pracy"],
  },
  {
    id: "rekuperacja-w-domu",
    category: "Rekuperacja",
    readTime: "5 min",
    title: "Kiedy warto zaplanować rekuperację?",
    excerpt: "Najlepiej już na etapie projektu lub większego remontu. Wtedy łatwiej poprowadzić kanały, dobrać centralę i uniknąć późniejszych kompromisów.",
    linkLabel: "Czytaj więcej",
    content: [
      "Rekuperację najłatwiej zaplanować na etapie projektu budynku albo przed większym remontem. Pozwala to rozsądnie poprowadzić kanały, dobrać miejsce centrali i przygotować przepusty.",
      "Dobrze wykonana wentylacja mechaniczna poprawia jakość powietrza, pomaga utrzymać stabilną wilgotność i ogranicza straty ciepła. To rozwiązanie szczególnie ważne w szczelnych, nowoczesnych budynkach.",
      "Przed wyceną warto przygotować rzut budynku, informacje o liczbie pomieszczeń i oczekiwania dotyczące komfortu. Na tej podstawie można dobrać układ instalacji oraz zakres prac.",
    ],
    checklist: ["rzuty budynku", "miejsce na centralę", "trasy kanałów", "oczekiwany komfort wentylacji"],
  },
  {
    id: "ogrzewanie-podlogowe",
    category: "Ogrzewanie",
    readTime: "3 min",
    title: "Co ustalić przed ogrzewaniem podłogowym?",
    excerpt: "Kluczowy jest układ pomieszczeń, warstwy podłogi, źródło ciepła i planowane wykończenie. Dobra podłogówka zaczyna się od projektu, nie od samego montażu.",
    linkLabel: "Czytaj więcej",
    content: [
      "Ogrzewanie podłogowe wymaga dobrego rozplanowania pętli, rozdzielaczy i warstw podłogi. Warto ustalić to przed pracami wykończeniowymi, aby uniknąć przeróbek.",
      "Znaczenie ma źródło ciepła, izolacja budynku, układ pomieszczeń oraz typ posadzki. Inne parametry będą właściwe dla salonu, inne dla łazienki czy korytarza.",
      "Dobra instalacja powinna być szczelna, czytelnie podzielona na strefy i przygotowana do późniejszej regulacji. To wpływa na komfort oraz koszty użytkowania.",
    ],
    checklist: ["układ pomieszczeń", "warstwy podłogi", "źródło ciepła", "rozdzielacze i strefy"],
  },
];

type GuidePost = (typeof guidePosts)[number];

const guideCategories = ["Klimatyzacja", "Rekuperacja", "Woda-kanalizacja", "Ogrzewanie", "Wyceny"];

const faqItems = [
  {
    question: "Jakie instalacje wykonuje OAT Instalacje?",
    answer: "OAT Instalacje wykonuje klimatyzację, wentylację, rekuperację, instalacje wodno-kanalizacyjne, centralne ogrzewanie, ogrzewanie podłogowe oraz projekty i wyceny instalacji sanitarnych.",
  },
  {
    question: "Czy obsługujecie domy, mieszkania i firmy?",
    answer: "Tak. Oferta obejmuje domy, mieszkania, biura, lokale usługowe, obiekty użyteczności publicznej i inwestycje realizowane dla przedsiębiorców.",
  },
  {
    question: "Czy przygotowujecie indywidualne wyceny?",
    answer: "Tak. Wyceny są przygotowywane indywidualnie dla klientów prywatnych, inwestorów i przedsiębiorców, po rozpoznaniu zakresu prac oraz warunków technicznych.",
  },
  {
    question: "Czy wykonujecie projekty instalacji sanitarnych?",
    answer: "Tak. OAT Instalacje oferuje projekty instalacji sanitarnych oraz kompleksowe przeprowadzenie klienta od pomysłu, przez wycenę, po realizację.",
  },
  {
    question: "Czy montujecie rekuperację?",
    answer: "Tak. Wykonujemy wentylację mechaniczną i rekuperację, dobierając rozwiązanie do budynku, układu pomieszczeń oraz oczekiwań użytkownika.",
  },
  {
    question: "Czy wykonujecie ogrzewanie podłogowe?",
    answer: "Tak. Wykonujemy ogrzewanie podłogowe, w tym rozplanowanie pętli, montaż instalacji, próby szczelności i przygotowanie do dalszych prac wykończeniowych.",
  },
  {
    question: "Jak najlepiej rozpocząć współpracę?",
    answer: "Najlepiej wysłać krótkie zapytanie z opisem inwestycji, lokalizacją, oczekiwanym zakresem prac i, jeśli to możliwe, zdjęciami lub rzutem budynku.",
  },
  {
    question: "Czy pytanie ofertowe coś kosztuje?",
    answer: "Nie. Zgodnie z komunikatem OAT, pytanie nic nie kosztuje. Warto skontaktować się i omówić zakres, zanim zapadną decyzje projektowe lub zakupowe.",
  },
  {
    question: "Czy po realizacji można liczyć na wsparcie?",
    answer: "Tak. Firma deklaruje wsparcie posprzedażowe i pomoc techniczną po wykonaniu instalacji.",
  },
  {
    question: "Jak skontaktować się z OAT Instalacje?",
    answer: "Najprościej zadzwonić pod numer 665 610 051 albo napisać na adres biuro@oatinstalacje.pl.",
  },
];

const Logo = ({ variant = "full", className = "" }: { variant?: "full" | "compact" | "mono", className?: string }) => {
  return (
    <span
      className={`inline-flex items-center ${variant === "compact" ? "" : "rounded-[22px] border border-white/70 bg-white px-4 py-2.5 shadow-2xl shadow-black/35"} ${className}`}
      id={`logo-${variant}`}
    >
      <img
        src={oatLogo}
        width={230}
        height={68}
        alt="OAT Instalacje"
        className="block h-auto w-full max-w-[230px]"
      />
    </span>
  );
};

type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  primary?: boolean;
};

const MagneticButton = ({ children, className = "", onClick, primary = false, ...props }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPos({ x: x * 0.3, y: y * 0.3 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      type={props.type ?? "button"}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-8 py-4 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black ${primary ? "bg-brand-accent text-white" : "bg-transparent border border-white/10 hover:bg-white/5"} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

type BentoTileProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

const BentoTile = ({ children, className = "", delay = 0, ...props }: BentoTileProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass rounded-bento p-8 relative overflow-hidden group hover:border-brand-accent/30 transition-colors ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </motion.div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 pb-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-xl md:text-2xl font-medium group-hover:text-brand-accent transition-colors">
          {question}
        </span>
        {isOpen ? <Minus className="w-6 h-6 text-brand-accent" /> : <Plus className="w-6 h-6 text-white/30" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mt-6 text-white/50 leading-relaxed text-lg max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    topic: contactTopics[0],
    message: "",
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target instanceof HTMLInputElement && event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;

    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setSubmitted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = [
      `Imię i nazwisko: ${formData.name}`,
      formData.company ? `Firma: ${formData.company}` : "",
      `E-mail: ${formData.email}`,
      formData.phone ? `Telefon: ${formData.phone}` : "",
      `Temat: ${formData.topic}`,
      "",
      "Wiadomość:",
      formData.message,
    ].filter(Boolean).join("\n");

    window.location.href = `mailto:${siteConfig.emails.secretariatOffice}?subject=${encodeURIComponent(`Formularz kontaktowy - ${formData.topic}`)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 mt-16 rounded-bento border border-white/10 bg-black/25 p-6 text-left sm:p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-brand-accent">Formularz kontaktowy</span>
          <h3 className="mt-3 text-2xl font-display font-bold">Napisz do nas</h3>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-white/45">
          Wypełnij formularz, a przygotujemy wiadomość e-mail z kompletem danych do wysłania.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="p-0">
          <span className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">Imię i nazwisko</span>
          <input
            required
            value={formData.name}
            onChange={updateField("name")}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-brand-accent/60"
            placeholder="Jan Kowalski"
            type="text"
          />
        </label>

        <label className="p-0">
          <span className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">Firma</span>
          <input
            value={formData.company}
            onChange={updateField("company")}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-brand-accent/60"
            placeholder="Opcjonalnie"
            type="text"
          />
        </label>

        <label className="p-0">
          <span className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">E-mail</span>
          <input
            required
            value={formData.email}
            onChange={updateField("email")}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-brand-accent/60"
            placeholder="adres@email.pl"
            type="email"
          />
        </label>

        <label className="p-0">
          <span className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">Telefon</span>
          <input
            value={formData.phone}
            onChange={updateField("phone")}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-brand-accent/60"
            placeholder="Opcjonalnie"
            type="tel"
          />
        </label>

        <label className="p-0 md:col-span-2">
          <span className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">Temat</span>
          <select
            value={formData.topic}
            onChange={updateField("topic")}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm text-white outline-none transition focus:border-brand-accent/60"
          >
            {contactTopics.map((topic) => (
              <option key={topic} value={topic} className="bg-brand-black text-white">
                {topic}
              </option>
            ))}
          </select>
        </label>

        <label className="p-0 md:col-span-2">
          <span className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">Wiadomość</span>
          <textarea
            required
            value={formData.message}
            onChange={updateField("message")}
            className="min-h-36 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-brand-accent/60"
            placeholder="Opisz krótko projekt, lokalizację, typ obiektu lub problem serwisowy."
          />
        </label>
      </div>

      <label className="mt-6 flex gap-3 p-0 text-xs leading-relaxed text-white/45">
        <input
          required
          checked={formData.consent}
          onChange={updateField("consent")}
          className="mt-1 h-4 w-4 shrink-0 accent-brand-accent"
          type="checkbox"
        />
        <span>
          Wyrażam zgodę na kontakt zwrotny w celu obsługi zapytania. {siteConfig.contactNotice}
        </span>
      </label>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <MagneticButton primary className="w-full text-base sm:w-auto" type="submit">
          Wyślij formularz <Send className="ml-3 h-4 w-4" />
        </MagneticButton>
        {submitted && (
          <p className="text-sm text-white/50">
            Otworzyliśmy gotową wiadomość e-mail do wysłania.
          </p>
        )}
      </div>
    </form>
  );
};

const BlogArticlePage = ({ post }: { post: GuidePost }) => {
  return (
    <section className="min-h-screen px-6 pb-32 pt-36 md:pt-44">
      <div className="mx-auto max-w-7xl">
        <a
          href="#guide"
          className="mb-12 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-brand-accent transition hover:gap-5"
        >
          <ArrowRight className="h-3 w-3 rotate-180" />
          Wróć do poradnika
        </a>

        <article className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-bento border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl sm:p-12 lg:p-16">
            <div className="mb-10 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white/45">
                {post.category}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">
                {post.readTime} czytania
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-display font-bold leading-[1.05] tracking-tight md:text-7xl">
              {post.title}
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-white/55">
              {post.excerpt}
            </p>

            <div className="my-12 h-px bg-white/10" />

            <div className="space-y-7 text-lg leading-relaxed text-white/62">
              {post.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 rounded-3xl border border-brand-accent/30 bg-brand-accent/10 p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-brand-accent">Wniosek praktyczny</p>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                Jeśli masz wątpliwości, najlepiej zacząć od krótkiej rozmowy i kilku informacji o obiekcie. Dobry dobór lub serwis zawsze zaczyna się od kontekstu, a nie od gotowej odpowiedzi z katalogu.
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-bento border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl lg:sticky lg:top-36">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-brand-accent">W artykule</p>
            <ul className="mt-6 space-y-4 text-sm text-white/58">
              {post.checklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/10 pt-7">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Potrzebujesz wyceny?</p>
              <MagneticButton primary className="mt-5 w-full px-5 py-4 text-sm" onClick={() => (window.location.href = "#contact")}>
                Zapytaj o ofertę <ArrowRight className="ml-3 h-4 w-4" />
              </MagneticButton>
            </div>
          </aside>
        </article>
      </div>
    </section>
  );
};

// --- Sections ---

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [kineticIndex, setKineticIndex] = useState(0);
  const [activeRealizationCategory, setActiveRealizationCategory] = useState("all");
  const [visibleRealizationsCount, setVisibleRealizationsCount] = useState(initialRealizationsLimit);
  const [activeBackgroundVideo, setActiveBackgroundVideo] = useState<"primary" | "secondary">("primary");
  const [selectedGuidePost, setSelectedGuidePost] = useState(guidePosts[0].id);
  const [isGuideAsideVisible, setIsGuideAsideVisible] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeBlogPostId, setActiveBlogPostId] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return hash.startsWith("blog/") ? hash.replace("blog/", "") : "";
  });
  const words = ["Projektujemy", "Wyceniamy", "Realizujemy"];
  const activeBlogPost = guidePosts.find((post) => post.id === activeBlogPostId);
  const filteredRealizations = activeRealizationCategory === "all"
    ? realizations
    : realizations.filter((realization) => realization.categorySlug === activeRealizationCategory);
  const visibleRealizations = filteredRealizations.slice(0, visibleRealizationsCount);
  const hasMoreRealizations = visibleRealizationsCount < filteredRealizations.length;
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setKineticIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setVisibleRealizationsCount(initialRealizationsLimit);
  }, [activeRealizationCategory]);

  useEffect(() => {
    const updateActiveBlogPost = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveBlogPostId(hash.startsWith("blog/") ? hash.replace("blog/", "") : "");
    };

    updateActiveBlogPost();
    window.addEventListener("hashchange", updateActiveBlogPost);

    return () => window.removeEventListener("hashchange", updateActiveBlogPost);
  }, []);

  useEffect(() => {
    if (!activeBlogPostId) {
      return;
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [activeBlogPostId]);

  useEffect(() => {
    const updateBackToTopVisibility = () => {
      setShowBackToTop(window.scrollY > 700);
    };

    updateBackToTopVisibility();
    window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateBackToTopVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const primaryVideoRef = useRef<HTMLVideoElement>(null);
  const secondaryVideoRef = useRef<HTMLVideoElement>(null);
  const isVideoCrossfadingRef = useRef(false);
  
  useEffect(() => {
    if (primaryVideoRef.current) {
      primaryVideoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  const handleBackgroundVideoTimeUpdate = (videoKey: "primary" | "secondary") => {
    if (videoKey !== activeBackgroundVideo || isVideoCrossfadingRef.current) {
      return;
    }

    const currentVideo = videoKey === "primary" ? primaryVideoRef.current : secondaryVideoRef.current;
    const nextVideo = videoKey === "primary" ? secondaryVideoRef.current : primaryVideoRef.current;

    if (!currentVideo || !nextVideo || !Number.isFinite(currentVideo.duration)) {
      return;
    }

    if (currentVideo.duration - currentVideo.currentTime > backgroundVideoFadeSeconds) {
      return;
    }

    isVideoCrossfadingRef.current = true;
    nextVideo.currentTime = backgroundVideoStartOffset;
    nextVideo.play().catch(error => {
      console.error("Video crossfade failed:", error);
      isVideoCrossfadingRef.current = false;
    });
    setActiveBackgroundVideo(videoKey === "primary" ? "secondary" : "primary");

    window.setTimeout(() => {
      currentVideo.pause();
      currentVideo.currentTime = backgroundVideoStartOffset;
      isVideoCrossfadingRef.current = false;
    }, backgroundVideoFadeMs + 120);
  };

  return (
    <div className="relative min-h-screen text-brand-white font-sans selection:bg-brand-accent selection:text-white">
      {/* Background Video Layer - Explicit Visibility */}
      <div 
        className="fixed inset-0 pointer-events-none overflow-hidden" 
        style={{ zIndex: 1 }}
      >
        <video
          ref={primaryVideoRef}
          autoPlay 
          muted 
          playsInline
          preload="auto"
          onTimeUpdate={() => handleBackgroundVideoTimeUpdate("primary")}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
            activeBackgroundVideo === "primary" ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "brightness(0.9) saturate(1.2)" }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <video
          ref={secondaryVideoRef}
          muted
          playsInline
          preload="auto"
          onTimeUpdate={() => handleBackgroundVideoTimeUpdate("secondary")}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
            activeBackgroundVideo === "secondary" ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "brightness(0.9) saturate(1.2)" }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        {/* Subtle overlays */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black" />
        <InteractiveFlowField />
      </div>

      {/* Main Content Layer */}
      <div className="relative" style={{ zIndex: 2 }}>
        <div className="fixed inset-0 pointer-events-none z-[999] noise-overlay" />
        
        {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 glass px-4 md:px-8 py-3 md:py-4 rounded-full relative">
          <Logo className="w-[150px] sm:w-[175px] lg:w-[190px] xl:w-[220px] shrink-0 origin-left" />
          
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-mono text-[11px] xl:text-xs uppercase tracking-[0.2em] text-white/60">
            <a href="#about" className="hover:text-white transition-colors">O Firmie</a>
            <a href="#offer" className="hover:text-white transition-colors">Oferta</a>
            <a href="#projects" className="hover:text-white transition-colors">Zakres prac</a>
            <a href="#service" className="hover:text-white transition-colors">Wsparcie</a>
            <a href="#guide" className="hover:text-white transition-colors">Poradnik</a>
            <a href="#contact" className="hover:text-white transition-colors">Kontakt</a>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <a href={phoneHref(siteConfig.phone)} className="hidden sm:block font-mono text-xs text-white/80 hover:text-brand-accent transition-colors">
              {siteConfig.phoneDisplay}
            </a>
            <div className="hidden sm:block">
              <MagneticButton primary className="text-[10px] py-2 md:py-3 px-4 md:px-6" onClick={() => (window.location.href = "#contact")}>
                ZAPYTAJ O OFERTĘ
              </MagneticButton>
            </div>
            
            <button 
              type="button"
              aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={isMenuOpen}
              className="lg:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <Minus /> : <Plus />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 w-full mt-4 glass rounded-3xl p-8 lg:hidden flex flex-col gap-6 text-center"
              >
                <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl font-display">O Firmie</a>
                <a href="#offer" onClick={() => setIsMenuOpen(false)} className="text-xl font-display">Oferta</a>
                <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-xl font-display">Zakres prac</a>
                <a href="#service" onClick={() => setIsMenuOpen(false)} className="text-xl font-display">Wsparcie</a>
                <a href="#guide" onClick={() => setIsMenuOpen(false)} className="text-xl font-display">Poradnik</a>
                <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-xl font-display text-brand-accent">Kontakt</a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main>
      {activeBlogPost ? (
        <BlogArticlePage post={activeBlogPost} />
      ) : (
      <>
      {/* Hero Section */}
      <header className="relative h-screen flex flex-col justify-end px-6 pb-20 overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4" />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto w-full relative z-10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="max-w-5xl">
              <div className="text-clamp font-display font-medium mb-8">
                {words.map((word, idx) => {
                  const isActive = idx === kineticIndex;

                  return (
                    <span
                      key={word}
                      className={`block text-white transition-[opacity,filter,transform] ease-out ${
                        isActive
                          ? "opacity-100 blur-0 duration-500 delay-150"
                          : "opacity-[0.14] blur-[1px] duration-200 delay-0"
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
              <p className="text-xl md:text-2xl text-white/40 max-w-xl font-light">
                Skuteczne rozwiązania instalacji sanitarnych dla domów, biur i obiektów użytkowych.
              </p>
            </div>

            <div className="lg:text-right flex flex-col gap-2 items-start lg:items-end font-mono text-[9px] text-white/30 tracking-[0.3em] uppercase">
              <span>OAT INSTALACJE</span>
              <span>PROJEKTY / WYCENY / REALIZACJE</span>
              <span>Pytanie nic nie kosztuje</span>
              <motion.a 
                href="#projects"
                whileHover={{ x: 5 }}
                className="mt-8 flex items-center gap-3 text-white/80 tracking-normal hover:text-brand-accent transition-colors"
              >
                Zobacz realizacje <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Partners Bar */}
      <section className="py-24 border-y border-white/10 bg-brand-black/35 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <span className="h-px w-16 bg-brand-accent" />
            <p className="rounded-full border border-brand-accent/30 bg-brand-accent/10 px-5 py-2 font-mono text-[11px] tracking-[0.32em] uppercase text-white/85">
              Marki i systemy wykorzystywane w realizacjach
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {partnerLogos.map((partner) => (
              <div
                key={partner.name}
                className="h-24 rounded-lg border border-white/10 bg-white/[0.92] px-6 py-5 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <img
                  src={partner.src}
                  alt={`${partner.name} logo`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
            Panasonic · Hisense · Kaisai · AUX · Immergas · Klimor · Viessmann · KAN
          </p>
        </div>
      </section>

      {/* Bento Grid - Offer */}
      <section id="offer" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-20">
            <span className="font-mono text-xs text-brand-accent">/01</span>
            <h2 className="text-4xl font-display font-medium">Co robimy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[280px]">
            {/* Instalacje sanitarne */}
            <BentoTile className="md:col-span-8 md:row-span-2 flex flex-col justify-end">
              <div className="relative z-10">
                <Wrench className="w-12 h-12 text-brand-heat mb-8" />
                <h3 className="text-4xl font-display font-bold mb-4">Instalacje sanitarne</h3>
                <p className="text-white/50 text-lg max-w-sm mb-8 leading-relaxed">
                  Kompleksowe instalacje wody, kanalizacji, ogrzewania i wentylacji. Od projektu i wyceny po sprawną realizację.
                </p>
                <div className="flex gap-4">
                  <span className="px-4 py-1.5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-mono">Domy</span>
                  <span className="px-4 py-1.5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-mono">Biura</span>
                  <span className="px-4 py-1.5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-mono">Inwestycje</span>
                </div>
              </div>
              <div className="absolute top-10 right-10 opacity-5 scale-150">
                <Settings className="w-64 h-64 animate-spin-slow" style={{ animationDuration: "20s" }} />
              </div>
            </BentoTile>

            {/* Klimatyzacja */}
            <BentoTile className="md:col-span-4 md:row-span-2">
              <Wind className="w-10 h-10 text-white/30 mb-8" />
              <h3 className="text-2xl font-display font-bold mb-6">Klimatyzacja</h3>
              <ul className="space-y-4 text-white/40 font-mono text-xs uppercase tracking-widest">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-brand-accent" /> Dla domu</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-brand-accent" /> Dla biura</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-brand-accent" /> Dla przemysłu</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-brand-accent" /> Precyzyjna</li>
              </ul>
              <div className="mt-12 pt-12 border-t border-white/5">
                <p className="text-white/40 text-[11px] leading-relaxed">
                  Montaż klimatyzacji w domach, mieszkaniach, biurach i obiektach użyteczności publicznej.
                </p>
              </div>
            </BentoTile>

            {/* Wentylacja */}
            <BentoTile className="md:col-span-5 md:row-span-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">Wentylacja & Rekuperacja</h3>
                  <p className="text-white/50 text-sm">Odzysk ciepła i stały dopływ świeżego powietrza bez strat energii.</p>
                </div>
                <Zap className="w-8 h-8 text-brand-accent opacity-20" />
              </div>
            </BentoTile>

            {/* Ogrzewanie */}
            <BentoTile className="md:col-span-3 md:row-span-1 bg-brand-accent/5 overflow-hidden">
              <h3 className="text-xl font-display font-bold mb-2">Pompy ciepła, CO i podłogówka</h3>
              <p className="text-white/50 text-sm">Pompy ciepła, kotłownie oraz instalacje grzewcze dopasowane do budynku.</p>
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <Zap className="w-24 h-24 text-brand-accent" />
              </div>
            </BentoTile>

            {/* Serwis */}
            <BentoTile className="md:col-span-4 md:row-span-1 border-white/20">
              <h3 className="text-xl font-display font-bold mb-2">Projekty i wyceny</h3>
              <p className="text-white/50 text-sm mb-6">Indywidualne wyceny dla klientów, inwestorów i przedsiębiorców.</p>
              <a href={phoneHref(siteConfig.phone)} className="text-brand-accent text-xs font-mono tracking-widest flex items-center gap-2">
                ZADZWOŃ <ArrowRight className="w-3 h-3" />
              </a>
            </BentoTile>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section id="services" className="py-40 px-6 border-y border-white/5 bg-brand-black/25">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs text-brand-accent">/01A</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/35">Zakres usług</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight">Usługi instalacyjne</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/45">
                Od pojedynczego klimatyzatora po pełne instalacje sanitarne dla domu, biura i inwestycji. Każdy zakres prowadzimy od projektu i wyceny po montaż oraz wsparcie po realizacji.
              </p>
            </div>
            <MagneticButton primary onClick={() => (window.location.href = "#contact")}>
              Zapytaj o wycenę <ArrowRight className="ml-3 h-4 w-4" />
            </MagneticButton>
          </div>

          <div className="mb-14 rounded-bento border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl md:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-brand-accent">Zakres naszej oferty</p>
                <h3 className="text-3xl font-display font-bold md:text-4xl">Oferujemy kompleksowe rozwiązania z zakresu</h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-white/45">
                Pełny zakres został przeniesiony z materiałów OAT i uporządkowany tak, aby klient szybko znalazł właściwą usługę.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {offerScopeItems.map((item, index) => (
                <li key={item} className="flex min-h-20 gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-white/60">
                  <span className="font-mono text-[10px] text-brand-accent">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceDetails.map((service) => {
              const Icon = service.icon;

              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.65 }}
                  className="group rounded-bento border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-brand-accent/40 hover:bg-white/[0.07]"
                >
                  <div className="mb-8 flex items-start justify-between gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-brand-accent">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="font-mono text-xs text-white/25">{service.number}</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold">{service.title}</h3>
                  <p className="mt-5 text-sm leading-relaxed text-white/55">{service.lead}</p>
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="mb-4 font-mono text-[9px] uppercase tracking-widest text-white/30">Obejmuje</p>
                    <ul className="space-y-3 text-sm text-white/55">
                      {service.bullets.map((item) => (
                        <li key={item} className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-7 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-white/35">
                    Dla: {service.bestFor}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs text-brand-accent">/01B</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/35">Jak pracujemy</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight">Proces współpracy</h2>
            <p className="mt-6 text-lg leading-relaxed text-white/45">
              Przewidywalny proces zmniejsza ryzyko po stronie inwestora. Dlatego prowadzimy projekt krok po kroku: od rozpoznania potrzeb do serwisu po uruchomieniu.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-bento border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="bg-brand-black/80 p-8">
                <div className="mb-10 flex items-center justify-between">
                  <span className="font-mono text-xs text-brand-accent">KROK {String(index + 1).padStart(2, "0")}</span>
                  {index === 0 ? <FileText className="h-5 w-5 text-white/25" /> : null}
                  {index === 1 ? <CalendarCheck className="h-5 w-5 text-white/25" /> : null}
                  {index === 2 ? <Settings className="h-5 w-5 text-white/25" /> : null}
                  {index === 3 ? <ClipboardCheck className="h-5 w-5 text-white/25" /> : null}
                  {index === 4 ? <Wrench className="h-5 w-5 text-white/25" /> : null}
                  {index === 5 ? <CheckCircle2 className="h-5 w-5 text-white/25" /> : null}
                </div>
                <h3 className="text-2xl font-display font-bold">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/50">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide */}
      <section id="guide" className="scroll-mt-40 py-40 px-6 border-y border-white/5 bg-brand-black/25">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs text-brand-accent">/01C</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/35">Poradnik instalacyjny</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight">Wiedza z instalacji.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/45">
                Krótkie wpisy dla osób, które planują klimatyzację, rekuperację, wod-kan albo ogrzewanie podłogowe. Bez teorii dla teorii, tylko rzeczy przydatne przed rozmową o inwestycji.
              </p>
            </div>
            <MagneticButton
              onClick={() => setIsGuideAsideVisible((current) => !current)}
              className="px-6 py-4 text-sm"
              aria-expanded={isGuideAsideVisible}
              aria-controls="guide-aside"
            >
              {isGuideAsideVisible ? "Ukryj panel" : "Pokaż panel"}
              <BookOpen className="ml-3 h-4 w-4" />
            </MagneticButton>
          </div>

          <div className={`grid grid-cols-1 gap-6 ${isGuideAsideVisible ? "lg:grid-cols-[1fr_340px]" : ""}`}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {guidePosts.map((post) => {
                const isSelected = selectedGuidePost === post.id;

                return (
                  <article
                    key={post.id}
                    onClick={() => setSelectedGuidePost(post.id)}
                    className={`group cursor-pointer rounded-bento border p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
                      isSelected
                        ? "border-brand-accent/70 bg-brand-accent/10 shadow-[0_0_60px_rgba(225,43,55,0.18)]"
                        : "border-white/10 bg-white/[0.045] hover:border-brand-accent/40 hover:bg-white/[0.07]"
                    }`}
                  >
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      className="mb-8 flex w-full items-center justify-between gap-4 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                    >
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white/45">
                        {post.category}
                      </span>
                      <span className="font-mono text-[10px] text-brand-accent">{post.readTime}</span>
                    </button>
                    <h3 className="text-2xl font-display font-bold leading-tight">{post.title}</h3>
                    <p className="mt-5 text-sm leading-relaxed text-white/55">{post.excerpt}</p>
                    <a
                      href={`#blog/${post.id}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedGuidePost(post.id);
                      }}
                      className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-brand-accent transition group-hover:gap-4"
                    >
                      {post.linkLabel} <ArrowRight className="h-3 w-3" />
                    </a>
                  </article>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {isGuideAsideVisible && (
                <motion.aside
                  id="guide-aside"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.28 }}
                  className="rounded-bento border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl"
                >
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-brand-accent">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-brand-accent">Autor</p>
                  <h3 className="mt-3 text-2xl font-display font-bold">Zespół OAT Instalacje</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/55">
                    Notatki z praktyki projektowej, montażowej i serwisowej. Tematy dobieramy pod najczęstsze pytania klientów przed inwestycją.
                  </p>

                  <div className="mt-9 border-t border-white/10 pt-7">
                    <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/35">Kategorie</p>
                    <div className="flex flex-wrap gap-2">
                      {guideCategories.map((category) => (
                        <span key={category} className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/55">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Editorial - O firmie */}
      <section id="about" className="py-40 px-6 bg-brand-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-5xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="font-mono text-xs text-brand-accent">/02A</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/35">O nas</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-medium mb-10">
              Twój Partner w Klimatyzacji, Wentylacji i Ogrzewaniu
            </h2>
            <p className="max-w-4xl text-xl md:text-2xl text-white/50 font-light leading-snug">
              W OAT Instalacje świadczymy kompleksowe usługi z zakresu klimatyzacji, wentylacji i ogrzewania, oferując nowoczesne i efektywne rozwiązania dla domów, biur oraz sektora przemysłowego. Jesteśmy dumni z doświadczenia, zaangażowania w innowacje i zespołu specjalistów, którzy pracują z pasją, aby spełnić oczekiwania klientów.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {aboutSegments.map((segment) => (
              <article key={segment.title} className="rounded-bento border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-brand-accent">{segment.title}</p>
                <h3 className="text-2xl font-display font-bold">{segment.subtitle}</h3>
                <p className="mt-6 text-sm leading-relaxed text-white/55">{segment.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="grid grid-cols-2 gap-y-12 gap-x-8">
              {[
                { val: "01", lbl: "Punkt kontaktu" },
                { val: "9", lbl: "Zakresów oferty" },
                { val: "100%", lbl: "Indywidualna wycena" },
                { val: "0 zł", lbl: "Koszt zapytania" }
              ].map(stat => (
                <div key={stat.lbl} className="flex flex-col gap-2">
                  <span className="text-5xl font-mono font-bold text-white">{stat.val}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">{stat.lbl}</span>
                </div>
              ))}
            </div>

            <div className="rounded-bento border border-white/10 bg-black/20 p-8">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.35em] text-brand-accent">Dlaczego wybrać OAT Instalacje</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {aboutStrengths.map((strength) => (
                  <div key={strength} className="flex gap-3 text-sm leading-relaxed text-white/55">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
              <MagneticButton className="mt-10 group" onClick={() => (window.location.href = "#contact")}>
                Skontaktuj się z nami <ArrowUpRight className="ml-2 w-5 h-5 group-hover:rotate-45 transition-transform" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* Realizations */}
      <section id="projects" className="py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs text-brand-accent">/02</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/35">
                  {realizations.length} zakresów realizacji OAT
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight">Realizacje</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-white/45">
              Widoczne: {visibleRealizations.length} / {filteredRealizations.length}
            </div>
          </div>

          <div className="mb-12 flex gap-3 overflow-x-auto pb-3 no-scrollbar">
            {[{ slug: "all", name: "Wszystkie" }, ...realizationCategories].map((category) => {
              const isActive = activeRealizationCategory === category.slug;

              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setActiveRealizationCategory(category.slug)}
                  className={`shrink-0 rounded-full border px-5 py-3 font-mono text-[10px] uppercase tracking-widest transition ${
                    isActive
                      ? "border-brand-accent bg-brand-accent text-white"
                      : "border-white/10 bg-white/[0.04] text-white/45 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleRealizations.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: Math.min(index % 9, 6) * 0.035 }}
                className="group overflow-hidden rounded-bento border border-white/10 bg-white/[0.045] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-brand-accent/40 hover:bg-white/[0.07]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={project.image}
                    alt={project.investor}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white/45">
                      {project.category}
                    </span>
                    <span className="font-mono text-[10px] text-brand-accent">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-brand-accent">Typ realizacji</p>
                  <h3 className="text-2xl font-display font-bold leading-tight">{project.investor}</h3>
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/35">Zakres prac</p>
                    <p className="text-sm leading-relaxed text-white/55">{project.scope}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {hasMoreRealizations && (
            <div className="mt-14 flex justify-center">
              <MagneticButton
                onClick={() => setVisibleRealizationsCount((current) => current + realizationsLoadStep)}
                className="px-8 py-5 text-base"
              >
                Pokaż więcej realizacji
                <span className="ml-3 font-mono text-xs text-white/45">
                  {Math.min(realizationsLoadStep, filteredRealizations.length - visibleRealizations.length)}
                </span>
              </MagneticButton>
            </div>
          )}
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="py-40 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-tight italic"
          >
            "Pytanie nic nie kosztuje. Każde zapytanie traktujemy poważnie, bez ukrytych kosztów i bez przypadkowych rozwiązań."
          </motion.p>
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="w-12 h-0.5 bg-brand-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-white/30">Filozofia pracy OAT Instalacje</span>
          </div>
        </div>
      </section>

      {/* Service */}
      <section id="service" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 overflow-hidden rounded-bento border border-white/10 bg-white/[0.045] backdrop-blur-xl lg:grid-cols-12">
            <div className="relative p-8 sm:p-12 lg:col-span-5">
              <div className="absolute inset-0 bg-brand-accent/10" />
              <div className="relative z-10">
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent text-white">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-brand-accent">Wsparcie i opieka po realizacji</span>
                <h2 className="mt-5 text-5xl font-display font-bold tracking-tight md:text-5xl">
                  Instalacja ma działać. Nie tylko dobrze wyglądać w ofercie.
                </h2>
                <p className="mt-7 text-lg leading-relaxed text-white/55">
                  Po wykonaniu instalacji OAT zapewnia wsparcie posprzedażowe, pomoc techniczną i możliwość omówienia dalszych etapów prac lub modernizacji.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <MagneticButton primary onClick={() => (window.location.href = phoneHref(siteConfig.phone))}>
                    Zadzwoń <ArrowRight className="ml-3 h-4 w-4" />
                  </MagneticButton>
                  <MagneticButton onClick={() => (window.location.href = `mailto:${siteConfig.emails.service}`)}>
                    Napisz do biura
                  </MagneticButton>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-12 lg:col-span-7 lg:p-16">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {serviceResponseItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-6">
                    <CheckCircle2 className="mb-5 h-5 w-5 text-brand-accent" />
                    <p className="text-sm leading-relaxed text-white/60">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/35">Kontakt</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <a href={phoneHref(siteConfig.phone)} className="font-mono text-2xl font-bold text-brand-accent hover:text-white">
                    {siteConfig.phoneDisplay}
                  </a>
                  <a href={`mailto:${siteConfig.emails.service}`} className="break-all text-sm text-white/55 hover:text-brand-accent">
                    {siteConfig.emails.service}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-40 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-xs text-brand-accent block mb-4 uppercase tracking-[0.4em]">Wsparcie techniczne</span>
            <h2 className="text-4xl font-display font-medium">Często zadawane pytania</h2>
          </div>
          
          <div className="space-y-6">
            {faqItems.map((item) => (
              <div key={item.question}>
                <FAQItem question={item.question} answer={item.answer} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-40 px-6">
        <div className="max-w-7xl mx-auto glass rounded-bento p-8 sm:p-12 md:p-32 overflow-hidden text-center relative">
          <div className="absolute inset-0 bg-brand-accent/5 opacity-50 pointer-events-none" />
          <h2 className="text-[clamp(2rem,9vw,5rem)] md:text-8xl font-display font-bold leading-[1.05] md:leading-none tracking-tight md:tracking-tighter mb-12">Masz projekt? <br /> Porozmawiajmy.</h2>
          <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Złóż zapytanie ofertowe i pozwól nam dobrać zakres prac. Projekty, wyceny i realizacje instalacji sanitarnych prowadzimy konkretnie i bez ukrytych kosztów.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <MagneticButton primary className="text-base sm:text-xl px-8 sm:px-12 py-6 whitespace-normal" onClick={() => (window.location.href = `mailto:${siteConfig.emails.secretariat}`)}>
              Zapytanie ofertowe <ArrowRight className="ml-4" />
            </MagneticButton>
            <div className="flex flex-col items-start gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">Szybki kontakt</span>
              <a href={phoneHref(siteConfig.phone)} className="text-2xl font-mono text-brand-accent font-bold">
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>

          <ContactForm />

          <div className="relative z-10 mt-16 border-t border-white/10 pt-10 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-brand-accent">Dane firmy</span>
                <h3 className="mt-3 text-2xl font-display font-bold uppercase">OAT Instalacje</h3>
                <div className="mt-5 space-y-2 text-sm text-white/55">
                  {siteConfig.address.street && <p>{siteConfig.address.street}</p>}
                  {siteConfig.address.city && (
                    <p>{siteConfig.address.postal} {siteConfig.address.city}{siteConfig.address.region ? `, woj. ${siteConfig.address.region}` : ""}</p>
                  )}
                  {siteConfig.tax.nip && <p>NIP: {siteConfig.tax.nip}</p>}
                  {siteConfig.tax.regon && <p>REGON: {siteConfig.tax.regon}</p>}
                  <a href={`mailto:${siteConfig.emails.secretariat}`} className="block break-all text-brand-accent hover:text-white">
                    {siteConfig.emails.secretariat}
                  </a>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                {siteConfig.contactDepartments.map((department) => (
                  <div key={department.name} className="border-t border-white/10 pt-5">
                    <h4 className="text-lg font-display font-bold">{department.name}</h4>
                    {department.person && (
                      <p className="mt-2 text-sm text-white/60">{department.person}</p>
                    )}
                    {department.phones?.length ? (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        {department.phones.map((phone) => (
                          <a key={phone} href={phoneHref(phone)} className="font-mono text-brand-accent hover:text-white">
                            {phone}
                          </a>
                        ))}
                      </div>
                    ) : null}
                    {department.fax && (
                      <p className="mt-2 text-xs text-white/35">Fax: {department.fax}</p>
                    )}
                    <div className="mt-3 space-y-1 text-xs">
                      {department.emails.map((email) => (
                        <a key={email} href={`mailto:${email}`} className="block break-all text-white/55 hover:text-brand-accent">
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-10 max-w-4xl text-xs leading-relaxed text-white/35">
              {siteConfig.contactNotice}
            </p>
          </div>
        </div>
      </section>
      </>
      )}
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-brand-muted/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h1 className="text-[12vw] font-black font-display tracking-tighter leading-none opacity-5 uppercase select-none pointer-events-none">
              OAT INSTALACJE
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div>
              <h5 className="font-mono text-[10px] uppercase tracking-widest text-white/20 mb-8 font-bold">Firma</h5>
              <div className="text-white/60 space-y-2 text-sm">
                <p>OAT Instalacje</p>
                <p>Instalacje sanitarne, klimatyzacja, wentylacja i ogrzewanie.</p>
                {siteConfig.address.street && <p>{siteConfig.address.street}</p>}
                <a href={`mailto:${siteConfig.emails.secretariat}`} className="inline-flex items-center gap-2 text-brand-accent mt-4 hover:gap-4 transition-all">
                  Napisz do nas <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-mono text-[10px] uppercase tracking-widest text-white/20 mb-8 font-bold">Kontakt</h5>
              <div className="text-white/60 space-y-4 text-xs">
                {siteConfig.contactDepartments.map((department) => (
                  <div key={department.name}>
                    <p className="text-white/30 text-[9px] uppercase mb-1">{department.name}</p>
                    <a href={`mailto:${department.emails[0]}`} className="break-all hover:text-brand-accent">{department.emails[0]}</a>
                    {department.phones?.[0] && (
                      <a href={phoneHref(department.phones[0])} className="mt-1 block font-mono text-brand-accent hover:text-white">
                        {department.phones[0]}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-mono text-[10px] uppercase tracking-widest text-white/20 mb-8 font-bold">Oferta</h5>
              <ul className="text-white/60 space-y-2 text-sm">
                <li><a href="#offer" className="hover:text-white">Klimatyzacja</a></li>
                <li><a href="#offer" className="hover:text-white">Wentylacja mechaniczna</a></li>
                <li><a href="#offer" className="hover:text-white">Rekuperacja</a></li>
                <li><a href="#offer" className="hover:text-white">Instalacje wod-kan</a></li>
                <li><a href="#offer" className="hover:text-white">Centralne ogrzewanie</a></li>
                <li><a href="#offer" className="hover:text-white">Ogrzewanie podłogowe</a></li>
                <li><a href="#contact" className="hover:text-white">Projekty i wyceny</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-mono text-[10px] uppercase tracking-widest text-white/20 mb-8 font-bold">Firma</h5>
              <ul className="text-white/60 space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white">O firmie</a></li>
                <li><a href="#guide" className="hover:text-white">Poradnik instalacyjny</a></li>
                <li><a href="#projects" className="hover:text-white">Zakresy prac</a></li>
                <li><a href="#contact" className="hover:text-white">Kontakt</a></li>
                <li><a href="#contact" className="hover:text-white">Zapytanie ofertowe</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em]">
              © 2026 OAT Instalacje  ·  Wszelkie prawa zastrzeżone
            </span>
            <div className="flex gap-8">
              <Logo variant="compact" className="opacity-20 grayscale brightness-200" />
              <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em]">Projekty / Wyceny / Realizacje</span>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 z-[120] inline-flex items-center gap-3 rounded-full border border-white/10 bg-brand-accent px-5 py-4 text-sm font-medium text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:bg-white hover:text-brand-black"
            aria-label="Powrót do góry"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="hidden sm:inline">Powrót do góry</span>
          </motion.button>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
