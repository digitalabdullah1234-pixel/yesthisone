import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";

type Dish = {
  id: string;
  name: string;
  section: string;
  description: string;
  price: number;
  image: string;
  tag: string;
  accent: string;
};

type CartLine = {
  dish: Dish;
  quantity: number;
};

const photos = {
  wide:
    "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm83Up9qihXIoG9ZDosn8hLq66NWL-kPgGwdvkhmeY-sVYhuOrIQsgIcjzy2SthVYGTLZhRPQvYsAgEoTvVYM3MlMgOl5lptxb7toRNIQFDKDr22Whd_142fiUJQU9n4n4oCyKQ6OpHFrw=w1200-h800-k-no",
  portrait:
    "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmP0e7c4hB3BZ9VRFsuiAG71wFetpD92S1nxkBJ6XJfp9aZ8UIXKt8S3c8u0MFGFubnoV9q7C4YZXWjlNAw8R_P6flmlQPQnYWVKjV0BVbUBwqEPNDIu9-uhVC0H4DAu6dDfsmQ67yATLHF=w900-h1200-k-no",
};

const dishes: Dish[] = [
  {
    id: "ajwa",
    name: "Pizza Ajwa",
    section: "Signatures",
    description: "Charred tomato, fior di latte, Madinah ajwa, quiet chili.",
    price: 54,
    image: photos.wide,
    tag: "House signature",
    accent: "#efb36d",
  },
  {
    id: "rose",
    name: "Rose Pasta",
    section: "Pasta",
    description: "Silky rose sauce, basil oil, parmesan, a little heat.",
    price: 48,
    image: photos.portrait,
    tag: "Best seller",
    accent: "#e5a0a2",
  },
  {
    id: "truffle",
    name: "Truffle Mushroom",
    section: "Pizza",
    description: "Roasted mushrooms, fontina, black truffle, thyme.",
    price: 58,
    image: photos.portrait,
    tag: "Late night",
    accent: "#d9bb87",
  },
  {
    id: "burrata",
    name: "Burrata & Tomato",
    section: "To begin",
    description: "Creamy burrata, ripe tomato, basil, aged balsamic.",
    price: 36,
    image: photos.wide,
    tag: "Start here",
    accent: "#f0c37c",
  },
  {
    id: "margherita",
    name: "Margherita",
    section: "Pizza",
    description: "San Marzano, mozzarella, basil, olive oil, blistered base.",
    price: 42,
    image: photos.wide,
    tag: "A classic sharpened",
    accent: "#eaa269",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    section: "Dolci",
    description: "Mascarpone cream, espresso ladyfingers, cocoa.",
    price: 28,
    image: photos.portrait,
    tag: "The last word",
    accent: "#c99c77",
  },
];

const filters = ["All dishes", "Signatures", "Pizza", "Pasta", "To begin", "Dolci"];

function sar(value: number) {
  return `${value} SAR`;
}

function QuantityControl({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex items-center border border-[#c9b99e]/25 bg-[#211918]">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(-1)}
        className="p-2 text-[#cdbfac] transition hover:bg-[#49302a] hover:text-[#f6dfb4]"
      >
        <Minus size={13} strokeWidth={1.5} />
      </button>
      <span className="w-7 text-center font-mono text-[11px] text-[#f6ead9]">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(1)}
        className="p-2 text-[#cdbfac] transition hover:bg-[#49302a] hover:text-[#f6dfb4]"
      >
        <Plus size={13} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function BiancoOrderStudio() {
  const [activeFilter, setActiveFilter] = useState("All dishes");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [service, setService] = useState<"pickup" | "delivery">("pickup");
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const visibleDishes = useMemo(
    () =>
      activeFilter === "All dishes"
        ? dishes
        : dishes.filter((dish) => dish.section === activeFilter),
    [activeFilter],
  );

  const itemCount = cart.reduce((total, line) => total + line.quantity, 0);
  const subtotal = cart.reduce((total, line) => total + line.quantity * line.dish.price, 0);

  function addDish(dish: Dish) {
    setConfirmed(false);
    setCart((current) => {
      const existing = current.find((line) => line.dish.id === dish.id);
      if (existing) {
        return current.map((line) =>
          line.dish.id === dish.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { dish, quantity: 1 }];
    });
  }

  function changeQuantity(id: string, delta: number) {
    setCart((current) =>
      current.flatMap((line) =>
        line.dish.id === id
          ? line.quantity + delta > 0
            ? [{ ...line, quantity: line.quantity + delta }]
            : []
          : [line],
      ),
    );
  }

  return (
    <div
      className="min-h-[100dvh] bg-[#170f0e] text-[#f5eadb]"
      style={{
        fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
        backgroundImage:
          "radial-gradient(circle at 12% 8%, rgba(114,39,29,.24), transparent 25%), radial-gradient(circle at 82% 86%, rgba(206,144,77,.09), transparent 28%)",
      }}
    >
      <header className="sticky top-0 z-30 border-b border-[#ead8bb]/10 bg-[#1c1110]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-4">
            <div className="relative flex h-10 w-10 items-center justify-center border border-[#edc886]/50 text-[#edc886]">
              <span className="absolute inset-1 border border-[#edc886]/20" />
              <span className="font-serif text-[21px] italic">B</span>
            </div>
            <div>
              <p className="font-serif text-[25px] leading-none tracking-[-.04em] text-[#fff5e6]">Bianco</p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[.22em] text-[#b9a596]">Madinah · Cucina italiana</p>
            </div>
          </div>
          <div className="hidden items-center gap-8 text-[10px] uppercase tracking-[.2em] text-[#bca99a] md:flex">
            <span className="flex items-center gap-2"><Clock3 size={13} /> Open until 2 AM</span>
            <span className="h-4 w-px bg-[#ead8bb]/20" />
            <span>Al Qiblatayn</span>
          </div>
          <button
            type="button"
            onClick={() => document.getElementById("tray")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-3 border border-[#e6c17f]/60 px-3.5 py-2.5 text-[10px] uppercase tracking-[.16em] text-[#f4d497] transition hover:bg-[#e6c17f] hover:text-[#241512]"
          >
            <ShoppingBag size={15} strokeWidth={1.5} />
            <span className="hidden sm:inline">Your tray</span>
            <span className="min-w-4 text-center">{itemCount}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-5 md:px-10 md:py-8">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="overflow-hidden border border-[#ead8bb]/12 bg-[#1d1312]">
            <div className="grid min-h-[290px] grid-cols-1 border-b border-[#ead8bb]/12 lg:grid-cols-[1.06fr_.94fr]">
              <div className="relative flex flex-col justify-between overflow-hidden px-6 py-7 md:px-10 md:py-10">
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#e6c17f]/10" />
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#e6c17f]/10" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.28em] text-[#dfb775]">Order at your pace</p>
                  <h1 className="mt-5 max-w-[570px] font-serif text-[clamp(3.5rem,7vw,6.7rem)] leading-[.82] tracking-[-.055em] text-[#fff2e0]">
                    Make it<br /><em className="font-normal text-[#e5aa65]">a table.</em>
                  </h1>
                </div>
                <div className="mt-10 flex items-end justify-between gap-6">
                  <p className="max-w-[270px] text-sm leading-relaxed text-[#aa9687]">
                    Start with a signature, add a little something to share, and we&apos;ll take care of the rest.
                  </p>
                  <div className="hidden text-right sm:block">
                    <span className="font-serif text-5xl leading-none text-[#f5dfbb]">01</span>
                    <p className="mt-2 font-mono text-[8px] uppercase tracking-[.18em] text-[#8f7b71]">Choose your table</p>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[270px] overflow-hidden bg-[#381d1a]">
                <img src={photos.wide} alt="The warm dining room at Bianco" className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-screen" />
                <div className="absolute inset-0 bg-[linear-gradient(100deg,#1d1312_0%,rgba(29,19,18,.12)_55%,rgba(29,19,18,.18))]" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#f2cf96]">The room tonight</p>
                    <p className="mt-1 font-serif text-2xl italic text-[#fff0dc]">Warm lights, late plates.</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f5dfbb]/50 text-[#f5dfbb]">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {filters.map((filter) => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap border px-3.5 py-2 font-mono text-[9px] uppercase tracking-[.14em] transition ${
                      activeFilter === filter
                        ? "border-[#e7bd79] bg-[#e7bd79] text-[#261512]"
                        : "border-[#ead8bb]/15 text-[#ad988a] hover:border-[#e7bd79]/60 hover:text-[#f0d2a0]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <p className="shrink-0 font-mono text-[9px] uppercase tracking-[.18em] text-[#806d66]">
                {visibleDishes.length} dishes · 12 PM—2 AM
              </p>
            </div>

            <div className="grid gap-px border-t border-[#ead8bb]/10 bg-[#ead8bb]/10 md:grid-cols-2">
              {visibleDishes.map((dish, index) => {
                const line = cart.find((item) => item.dish.id === dish.id);
                const isDetailsOpen = showDetails === dish.id;
                return (
                  <article key={dish.id} className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-[#211817] p-5 transition hover:bg-[#281c1a] md:p-6">
                    <div className="absolute right-5 top-5 font-serif text-4xl leading-none text-[#e9c687]/15">0{index + 1}</div>
                    <div>
                      <div className="relative mb-5 h-20 w-20 overflow-hidden border border-[#ead8bb]/20">
                        <img src={dish.image} alt="" className="h-full w-full object-cover opacity-80 grayscale-[.08] transition duration-500 group-hover:scale-110 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-[#3d1815]/20" />
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-[.2em]" style={{ color: dish.accent }}>{dish.section}</p>
                          <h2 className="mt-2 font-serif text-[29px] leading-none tracking-[-.035em] text-[#fff0dd]">{dish.name}</h2>
                        </div>
                        <span className="font-mono text-[11px] text-[#e9c687]">{sar(dish.price)}</span>
                      </div>
                      <p className="mt-3 max-w-[285px] text-[12px] leading-relaxed text-[#a99487]">{dish.description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-[#ead8bb]/10 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowDetails(isDetailsOpen ? null : dish.id)}
                        className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.16em] text-[#8e796e] transition hover:text-[#dfb775]"
                      >
                        {dish.tag}
                        <ChevronDown size={12} className={isDetailsOpen ? "rotate-180 transition" : "transition"} />
                      </button>
                      {line ? (
                        <QuantityControl quantity={line.quantity} onChange={(delta) => changeQuantity(dish.id, delta)} />
                      ) : (
                        <button
                          type="button"
                          onClick={() => addDish(dish)}
                          className="flex items-center gap-2 border-b border-[#e7bd79] pb-1 font-mono text-[9px] uppercase tracking-[.16em] text-[#edc982] transition hover:text-[#fff0d2]"
                        >
                          Add to tray <Plus size={13} />
                        </button>
                      )}
                    </div>
                    {isDetailsOpen && (
                      <div className="absolute inset-x-0 bottom-0 border-t border-[#e7bd79]/30 bg-[#2b1a18] px-5 py-3 text-[11px] leading-relaxed text-[#d8c2aa]">
                        Prepared to order. Tell our team about allergies at checkout.
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <aside id="tray" className="flex h-fit flex-col border border-[#ead8bb]/14 bg-[#211615] xl:sticky xl:top-[101px]">
            <div className="border-b border-[#ead8bb]/12 px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.23em] text-[#dfb775]">02 · Your table</p>
                  <h2 className="mt-2 font-serif text-[42px] leading-none tracking-[-.04em] text-[#fff0dc]">The tray</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center border border-[#e7bd79]/50 text-[#e7bd79]">
                  <Utensils size={18} strokeWidth={1.2} />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {(["pickup", "delivery"] as const).map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setService(option)}
                    className={`border px-3 py-3 text-left font-mono text-[9px] uppercase tracking-[.15em] transition ${
                      service === option ? "border-[#e7bd79] bg-[#e7bd79]/10 text-[#f2d196]" : "border-[#ead8bb]/15 text-[#957f74]"
                    }`}
                  >
                    <span className="mb-1 block text-[8px] text-[#77635c]">{option === "pickup" ? "Ready in 25 min" : "Madinah only"}</span>
                    {option}
                    {service === option && <Check size={12} className="float-right text-[#e7bd79]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[290px] flex-1 px-6 py-2">
              {cart.length === 0 ? (
                <div className="flex min-h-[270px] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#e7bd79]/30 text-[#e7bd79]">
                    <Sparkles size={20} strokeWidth={1.2} />
                  </div>
                  <p className="font-serif text-3xl text-[#faeddc]">Keep it open.</p>
                  <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-[#957f74]">Your tray is a quiet place to gather a dinner worth staying up for.</p>
                </div>
              ) : (
                cart.map((line) => (
                  <div key={line.dish.id} className="flex gap-3 border-b border-[#ead8bb]/10 py-5">
                    <img src={line.dish.image} alt="" className="h-14 w-14 shrink-0 object-cover opacity-80" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-serif text-[22px] leading-none text-[#f8ead8]">{line.dish.name}</p>
                        <button type="button" onClick={() => changeQuantity(line.dish.id, -line.quantity)} aria-label={`Remove ${line.dish.name}`} className="text-[#806e66] transition hover:text-[#e4bd79]"><X size={14} /></button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <QuantityControl quantity={line.quantity} onChange={(delta) => changeQuantity(line.dish.id, delta)} />
                        <span className="font-mono text-[10px] text-[#dfb775]">{sar(line.dish.price * line.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#ead8bb]/12 bg-[#1b1211] px-6 py-6">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[.15em] text-[#8f7b72]">
                <span>Subtotal · {itemCount} {itemCount === 1 ? "plate" : "plates"}</span>
                <span className="font-mono text-[#f5dfb9]">{sar(subtotal)}</span>
              </div>
              <button
                type="button"
                disabled={!cart.length}
                onClick={() => setConfirmed(true)}
                className="mt-5 flex w-full items-center justify-between bg-[#e7bd79] px-5 py-4 text-[10px] font-semibold uppercase tracking-[.16em] text-[#251613] transition hover:bg-[#f4d59e] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span>{confirmed ? "Tray noted — thank you" : service === "pickup" ? "Start pickup order" : "Continue to delivery"}</span>
                {confirmed ? <Check size={16} /> : <ArrowRight size={16} />}
              </button>
              <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[.17em] text-[#756159]">
                No payment until you confirm with our team
              </p>
            </div>
          </aside>
        </div>

        <footer className="flex flex-col gap-4 border-t border-[#ead8bb]/12 py-7 text-[9px] uppercase tracking-[.18em] text-[#806d64] sm:flex-row sm:items-center sm:justify-between">
          <span>Bianco · Al Qiblatayn, Madinah</span>
          <span className="text-[#b89b76]">A late dinner, done properly.</span>
          <span>Daily · 12 PM—2 AM</span>
        </footer>
      </main>
    </div>
  );
}