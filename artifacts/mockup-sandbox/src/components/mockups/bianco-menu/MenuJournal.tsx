import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ShoppingBag,
  Utensils,
  X,
} from "lucide-react";
import "./_group.css";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  chapter: string;
  image: string;
  imagePosition?: string;
  note: string;
};

type CartLine = { product: Product; quantity: number };

const image = (name: string) => `/__mockup/images/bianco-menu/${name}`;

const products: Product[] = [
  {
    id: "pizza-ajwa",
    name: "Pizza Ajwa",
    price: 54,
    description: "Charred tomato, fior di latte, Madinah ajwa, and a quiet hit of chili.",
    category: "Signature",
    chapter: "Pizza",
    image: image("beef-bianco-pizza.png"),
    imagePosition: "center 52%",
    note: "The house signature",
  },
  {
    id: "rose-pasta",
    name: "Rose Pasta",
    price: 48,
    description: "Silky rose sauce, basil oil, parmesan, and a little heat at the finish.",
    category: "Pasta",
    chapter: "Pasta",
    image: image("penne-rose.png"),
    imagePosition: "center 35%",
    note: "Best seller",
  },
  {
    id: "margherita",
    name: "Margherita",
    price: 42,
    description: "San Marzano tomato, mozzarella, basil, and olive oil on a blistered base.",
    category: "Pizza",
    chapter: "Pizza",
    image: image("margherita-pizza.png"),
    imagePosition: "center 70%",
    note: "A classic, sharpened",
  },
  {
    id: "truffle-mushroom",
    name: "Truffle Mushroom",
    price: 58,
    description: "Roasted mushrooms, fontina, black truffle, and thyme over crisp dough.",
    category: "Pizza",
    chapter: "Pizza",
    image: image("truffle-pizza.png"),
    imagePosition: "center 64%",
    note: "For late nights",
  },
  {
    id: "burrata-tomato",
    name: "Burrata & Tomato",
    price: 36,
    description: "Creamy burrata, ripe tomato, basil, and aged balsamic.",
    category: "Starters",
    chapter: "Antipasti",
    image: image("burrata-salad.png"),
    imagePosition: "center 30%",
    note: "Start here",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    price: 28,
    description: "Mascarpone cream, espresso-soaked ladyfingers, cocoa, no unnecessary drama.",
    category: "Dolci",
    chapter: "Dolci",
    image: image("funghi-risotto.png"),
    imagePosition: "center 78%",
    note: "The last word",
  },
];

const chapters = ["All chapters", "Antipasti", "Pizza", "Pasta", "Dolci"];
const money = (value: number) => `${value} SAR`;

function QuantityControl({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex items-center border border-[#5b211b]/20 bg-[#f0e5d5]">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(-1)}
        className="focus-ring p-2 text-[#7f382b] transition hover:bg-[#dbb58f] hover:text-[#3f1713]"
      >
        <Minus size={12} strokeWidth={1.6} />
      </button>
      <span className="w-6 text-center font-mono-ui text-[10px] text-[#431712]">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(1)}
        className="focus-ring p-2 text-[#7f382b] transition hover:bg-[#dbb58f] hover:text-[#3f1713]"
      >
        <Plus size={12} strokeWidth={1.6} />
      </button>
    </div>
  );
}

function JournalRow({
  product,
  number,
  line,
  onAdd,
  onChangeQuantity,
  onDetails,
}: {
  product: Product;
  number: string;
  line?: CartLine;
  onAdd: () => void;
  onChangeQuantity: (delta: number) => void;
  onDetails: () => void;
}) {
  return (
    <article className="journal-row group relative border-t border-[#f0d5b9]/20 py-6 transition-colors duration-500 hover:bg-[#4a1a17] md:py-8">
      <div className="relative flex flex-col gap-5 md:min-h-[126px] md:flex-row md:items-center md:gap-8">
            <span className="w-10 shrink-0 font-mono-ui text-[10px] tracking-[.18em] text-[#e3a172] md:self-start md:pt-2">{number}</span>
        <button
          type="button"
          onClick={onDetails}
          className="focus-ring order-first h-40 w-full shrink-0 overflow-hidden text-start md:order-none md:h-[126px] md:w-[186px]"
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ objectPosition: product.imagePosition }}
            className="h-full w-full object-cover opacity-30 grayscale-[.35] transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
          />
        </button>
        <div className="min-w-0 flex-1 md:pr-8">
          <div className="flex items-baseline justify-between gap-4">
            <button type="button" onClick={onDetails} className="focus-ring text-start">
              <h3 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[.86] tracking-[-.055em] text-[#f8e9d6] transition-colors group-hover:text-[#f0bb8d]">{product.name}</h3>
            </button>
            <span className="shrink-0 font-mono-ui text-[11px] text-[#efb27f] md:hidden">{money(product.price)}</span>
          </div>
          <p className="mt-3 max-w-[480px] text-[13px] leading-relaxed text-[#dbc2ae]">{product.description}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="font-mono-ui text-[8px] uppercase tracking-[.18em] text-[#e1a173]">{product.note}</span>
            <span className="h-px w-8 bg-[#d79a68]/60" />
            <span className="font-mono-ui text-[8px] uppercase tracking-[.16em] text-[#cba895]">{product.category}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 md:w-[176px] md:shrink-0 md:justify-end">
          <span className="hidden font-mono-ui text-[11px] text-[#efb27f] md:block">{money(product.price)}</span>
          {line ? (
            <QuantityControl quantity={line.quantity} onChange={onChangeQuantity} />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="focus-ring flex items-center gap-2 border-b border-[#dba16f] pb-1 font-mono-ui text-[9px] font-bold uppercase tracking-[.15em] text-[#f0bc8d] transition hover:border-[#f0c39a] hover:text-[#ffe5ca]"
            >
              Add to order <Plus size={14} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function Chapter({
  name,
  chapterNumber,
  dishes,
  cart,
  onAdd,
  onChangeQuantity,
  onDetails,
}: {
  name: string;
  chapterNumber: string;
  dishes: Product[];
  cart: CartLine[];
  onAdd: (product: Product) => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onDetails: (product: Product) => void;
}) {
  if (!dishes.length) return null;

  return (
    <section id={`journal-${name.toLowerCase()}`} className="scroll-mt-28">
      <div className="mb-2 flex items-end justify-between border-b border-[#f0d5b9]/30 pb-4">
        <div className="flex items-end gap-4">
          <span className="font-display text-5xl leading-none text-[#e0a071]/70 md:text-7xl">{chapterNumber}</span>
          <div>
            <p className="font-mono-ui text-[9px] uppercase tracking-[.24em] text-[#e4a174]">Chapter {chapterNumber}</p>
            <h2 className="mt-1 font-display text-4xl leading-none tracking-[-.05em] text-[#f7e8d5] md:text-6xl">{name}</h2>
          </div>
        </div>
        <span className="hidden pb-1 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#c9a694] sm:block">{dishes.length} {dishes.length === 1 ? "dish" : "dishes"}</span>
      </div>
      <div>
        {dishes.map((product, index) => (
          <JournalRow
            key={product.id}
            product={product}
            number={`${chapterNumber}.${index + 1}`}
            line={cart.find((cartLine) => cartLine.product.id === product.id)}
            onAdd={() => onAdd(product)}
            onChangeQuantity={(delta) => onChangeQuantity(product.id, delta)}
            onDetails={() => onDetails(product)}
          />
        ))}
      </div>
    </section>
  );
}

export function MenuJournal() {
  const [selectedChapter, setSelectedChapter] = useState("All chapters");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trayOpen, setTrayOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const visibleProducts = useMemo(
    () => selectedChapter === "All chapters" ? products : products.filter((product) => product.chapter === selectedChapter),
    [selectedChapter],
  );
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const chooseChapter = (chapter: string) => {
    setSelectedChapter(chapter);
    if (chapter !== "All chapters") {
      requestAnimationFrame(() => document.getElementById(`journal-${chapter.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else {
      requestAnimationFrame(() => document.getElementById("journal-intro")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const addToCart = (product: Product) => {
    setOrderConfirmed(false);
    setCart((current) =>
      current.some((line) => line.product.id === product.id)
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { product, quantity: 1 }],
    );
  };

  const changeQuantity = (id: string, delta: number) => {
    setOrderConfirmed(false);
    setCart((current) =>
      current.flatMap((line) =>
        line.product.id === id
          ? line.quantity + delta > 0 ? [{ ...line, quantity: line.quantity + delta }] : []
          : [line],
      ),
    );
  };

  const chapterDishes = (chapter: string) => visibleProducts.filter((product) => product.chapter === chapter);

  return (
    <div className="bianco-menu min-h-screen bg-[#3b1412] text-[#f3e4d3]">
      <header className="border-b border-[#f1d4b5]/20 bg-[#3b1412]">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center border border-[#dba16f] text-[#e3a172]">
              <span className="absolute inset-1 border border-[#dba16f]/35" />
              <span className="font-display text-2xl italic">B</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-none tracking-[-.04em] text-[#f7e8d5]">Bianco</p>
              <p className="mt-1 font-mono-ui text-[8px] uppercase tracking-[.21em] text-[#d0aa93]">Madinah · cucina italiana</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#d1ab94] sm:flex">
            <span>Open until 02:00</span>
            <span className="h-4 w-px bg-[#e1b998]/30" />
            <span>Al Qiblatayn</span>
          </div>
          <button
            type="button"
            onClick={() => { setTrayOpen(true); document.getElementById("journal-tray")?.scrollIntoView({ behavior: "smooth" }); }}
            className="focus-ring flex items-center gap-2 border border-[#dba16f] px-3 py-2 font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#f0bc8d] transition hover:bg-[#dba16f] hover:text-[#3b1412]"
          >
            <ShoppingBag size={14} /> <span className="hidden sm:inline">Your table</span> {cartCount}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-5 pb-36 md:px-10">
        <section id="journal-intro" className="grid gap-9 border-b border-[#f1d4b5]/20 py-12 md:grid-cols-[1.15fr_.85fr] md:py-20 lg:gap-24">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[.29em] text-[#e4a174]">Journal 07 · service from noon</p>
            <h1 className="mt-6 max-w-[800px] font-display text-[clamp(4.1rem,10vw,9.5rem)] leading-[.77] tracking-[-.08em] text-[#f8ead8]">Tonight<br /><em className="font-normal text-[#e9a270]">at Bianco.</em></h1>
          </div>
          <div className="flex flex-col justify-end md:pb-2">
            <div className="mb-6 h-px w-14 bg-[#e2a071]" />
            <p className="max-w-[340px] font-display text-2xl leading-[1.05] tracking-[-.025em] text-[#f0d5bd] md:text-3xl">“The best plates arrive when the table has stopped trying to impress anyone.”</p>
            <p className="mt-5 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#d1aa91]">A note from the kitchen · Madinah</p>
          </div>
        </section>

        <nav className="sticky top-0 z-20 -mx-5 flex items-center justify-between gap-5 border-b border-[#f1d4b5]/20 bg-[#3b1412]/95 px-5 py-4 backdrop-blur-md md:-mx-10 md:px-10" aria-label="Journal sections">
          <p className="hidden shrink-0 font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#e4a174] sm:block">Read the menu</p>
          <div className="flex min-w-0 items-center gap-5 overflow-x-auto">
            {chapters.map((chapter, index) => (
              <button
                type="button"
                key={chapter}
                onClick={() => chooseChapter(chapter)}
                aria-current={selectedChapter === chapter ? "page" : undefined}
                className={`focus-ring shrink-0 border-b-2 pb-1 font-mono-ui text-[9px] uppercase tracking-[.16em] transition ${
                  selectedChapter === chapter ? "border-[#e3a071] text-[#f5d7bb]" : "border-transparent text-[#cba28e] hover:border-[#e1a071] hover:text-[#ffe4c9]"
                }`}
              >
                {String(index).padStart(2, "0")} · {chapter}
              </button>
            ))}
          </div>
          <span className="hidden shrink-0 font-mono-ui text-[9px] text-[#cba28e] md:block">{visibleProducts.length} plates</span>
        </nav>

        <div className="grid gap-16 pt-14 md:pt-20">
          <Chapter name="Antipasti" chapterNumber="01" dishes={chapterDishes("Antipasti")} cart={cart} onAdd={addToCart} onChangeQuantity={changeQuantity} onDetails={setSelectedProduct} />
          {selectedChapter === "All chapters" && (
            <section className="relative -mx-5 overflow-hidden bg-[#5d1b16] px-5 py-14 text-[#f2deca] md:-mx-10 md:px-10 md:py-20">
              <div className="absolute -end-20 -top-28 h-72 w-72 rounded-full border border-[#e2ab79]/25" />
              <div className="absolute -end-5 -top-12 h-40 w-40 rounded-full border border-[#e2ab79]/15" />
              <div className="relative grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
                <div>
                  <p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#e6ad78]">House note · 02</p>
                  <p className="mt-6 max-w-[500px] font-display text-[clamp(2.8rem,6vw,6.5rem)] leading-[.82] tracking-[-.07em]">Make room<br /><em className="font-normal text-[#eda273]">for the middle.</em></p>
                </div>
                <div className="relative h-52 overflow-hidden md:h-72">
                  <img src={image("margherita-pizza.png")} alt="A Margherita pizza at Bianco" style={{ objectPosition: "center 70%" }} className="h-full w-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5d1b16]/70 to-transparent" />
                  <p className="absolute bottom-5 start-5 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#f0c498]">Let the dough do the talking</p>
                </div>
              </div>
            </section>
          )}
          <Chapter name="Pizza" chapterNumber="02" dishes={chapterDishes("Pizza")} cart={cart} onAdd={addToCart} onChangeQuantity={changeQuantity} onDetails={setSelectedProduct} />
          <Chapter name="Pasta" chapterNumber="03" dishes={chapterDishes("Pasta")} cart={cart} onAdd={addToCart} onChangeQuantity={changeQuantity} onDetails={setSelectedProduct} />
          <Chapter name="Dolci" chapterNumber="04" dishes={chapterDishes("Dolci")} cart={cart} onAdd={addToCart} onChangeQuantity={changeQuantity} onDetails={setSelectedProduct} />
        </div>

        <footer className="mt-20 flex flex-col gap-3 border-t border-[#f1d4b5]/20 pt-6 font-mono-ui text-[9px] uppercase tracking-[.17em] text-[#c9a694] sm:flex-row sm:items-center sm:justify-between">
          <span>Bianco · Al Qiblatayn, Madinah</span>
          <span className="text-[#e2a071]">A late dinner, done properly.</span>
          <span>Daily · 12 PM—2 AM</span>
        </footer>
      </main>

      <div id="journal-tray" className={`fixed inset-x-3 bottom-3 z-40 transition-transform duration-500 lg:inset-x-auto lg:bottom-5 lg:start-1/2 lg:w-[min(620px,calc(100vw-80px))] lg:-translate-x-1/2 ${trayOpen ? "translate-y-0" : "translate-y-[calc(100%-62px)]"}`}>
        {trayOpen && (
          <div className="mb-3 max-h-[58vh] overflow-y-auto border border-[#dba16f]/35 bg-[#271715] p-4 shadow-[0_20px_70px_rgba(0,0,0,.42)] sm:p-5">
            <div className="mb-3 flex items-center justify-between border-b border-[#edc9aa]/15 pb-3">
              <div>
                <p className="font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#dba16f]">Your table · {cartCount} {cartCount === 1 ? "plate" : "plates"}</p>
                <p className="mt-1 font-display text-3xl leading-none text-[#f2ddc5]">Keep the evening open.</p>
              </div>
              <button type="button" aria-label="Collapse your table" onClick={() => setTrayOpen(false)} className="focus-ring text-[#c08d71] hover:text-[#f0bc91]"><ChevronDown size={18} /></button>
            </div>
            {cart.length === 0 ? (
              <p className="py-7 text-sm leading-relaxed text-[#a98575]">Your table is ready. Add something from the journal and it will stay here while you read.</p>
            ) : (
              <div className="space-y-3">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 border-b border-[#edc9aa]/10 pb-3">
                    <img src={product.image} alt="" style={{ objectPosition: product.imagePosition }} className="h-12 w-12 object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-display text-xl leading-none text-[#f3dfca]">{product.name}</p>
                        <button type="button" aria-label={`Remove ${product.name}`} onClick={() => changeQuantity(product.id, -quantity)} className="focus-ring text-[#8e665b] hover:text-[#e7af82]"><X size={14} /></button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <QuantityControl quantity={quantity} onChange={(delta) => changeQuantity(product.id, delta)} />
                        <span className="font-mono-ui text-[10px] text-[#e2aa79]">{money(product.price * quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-3 border border-[#dba16f]/60 bg-[#dba16f] p-2 ps-4 text-[#2a1411] shadow-[0_12px_40px_rgba(0,0,0,.3)]">
          <ShoppingBag size={17} />
          <div className="min-w-0 flex-1">
            <p className="font-mono-ui text-[9px] font-bold uppercase tracking-[.16em]">{cartCount ? `${cartCount} ${cartCount === 1 ? "plate" : "plates"} selected` : "Your table is open"}</p>
            <p className="font-mono-ui text-[9px] text-[#663528]">{cartCount ? `Subtotal · ${money(subtotal)}` : "Gather something good"}</p>
          </div>
          <button type="button" onClick={() => setTrayOpen((open) => !open)} className="focus-ring flex items-center gap-2 border border-[#5c281d]/35 px-3 py-2 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] transition hover:bg-[#f0bd91]">
            {trayOpen ? "Close" : "Open tray"} {trayOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          <button
            type="button"
            disabled={!cart.length}
            onClick={() => { setOrderConfirmed(true); setTrayOpen(true); }}
            className="focus-ring hidden bg-[#5d1d18] px-3 py-2 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] text-[#f8e4cc] transition hover:bg-[#742920] disabled:cursor-not-allowed disabled:opacity-35 sm:flex sm:items-center sm:gap-2"
          >
            {orderConfirmed ? "Noted" : "Checkout"} <ArrowUpRight size={14} />
          </button>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={() => { setOrderConfirmed(true); setTrayOpen(true); }}
            className="focus-ring mt-2 flex w-full items-center justify-between bg-[#5d1d18] px-4 py-3 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] text-[#f8e4cc] transition hover:bg-[#742920] sm:hidden"
          >
            <span>{orderConfirmed ? "Order noted — thank you" : "Review & checkout"}</span>
            {orderConfirmed ? <Utensils size={14} /> : <ArrowUpRight size={14} />}
          </button>
        )}
      </div>

      {selectedProduct && (
        <div role="dialog" aria-modal="true" aria-label={`${selectedProduct.name} details`} className="fixed inset-0 z-50 flex items-center justify-center bg-[#160b09]/75 p-4 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="w-full max-w-[620px] overflow-hidden border border-[#dba16f]/35 bg-[#f0e1cf] text-[#351512] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-56 sm:h-64">
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ objectPosition: selectedProduct.imagePosition }} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#351512]/75 to-transparent" />
              <button type="button" aria-label="Close details" onClick={() => setSelectedProduct(null)} className="focus-ring absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f2e1cd]/90 text-[#5f231b]"><X size={17} /></button>
              <p className="absolute bottom-5 start-5 font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#f1c89f]">{selectedProduct.chapter} · {selectedProduct.note}</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-5xl leading-[.82] tracking-[-.06em]">{selectedProduct.name}</h2>
                <span className="font-mono-ui text-[11px] text-[#91392b]">{money(selectedProduct.price)}</span>
              </div>
              <p className="mt-5 max-w-[470px] text-sm leading-relaxed text-[#805e50]">{selectedProduct.description}</p>
              <div className="mt-7 flex items-center justify-between border-t border-[#351512]/15 pt-5">
                <span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#966e5d]">Prepared to order</span>
                <button type="button" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="focus-ring flex items-center gap-3 bg-[#691e18] px-5 py-3 font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f7e4cc] transition hover:bg-[#843027]">Add to order <Plus size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}