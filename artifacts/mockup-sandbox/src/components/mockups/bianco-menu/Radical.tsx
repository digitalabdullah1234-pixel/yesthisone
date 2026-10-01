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
    image: image("funghi-risotto.png"),
    imagePosition: "center 78%",
    note: "The last word",
  },
];

const categories = ["All", "Signature", "Pizza", "Pasta", "Starters", "Dolci"];
const money = (value: number) => `${value} SAR`;

function QuantityControl({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex items-center border border-[#e8c5a3]/25 bg-[#2a1b18]">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(-1)}
        className="focus-ring p-2 text-[#d8ae88] transition hover:bg-[#633026] hover:text-[#f7dfc6]"
      >
        <Minus size={12} strokeWidth={1.5} />
      </button>
      <span className="w-6 text-center font-mono-ui text-[10px] text-[#f5e6d5]">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(1)}
        className="focus-ring p-2 text-[#d8ae88] transition hover:bg-[#633026] hover:text-[#f7dfc6]"
      >
        <Plus size={12} strokeWidth={1.5} />
      </button>
    </div>
  );
}

function RouteSlide({
  product,
  index,
  active,
  line,
  offset,
  onActivate,
  onAdd,
  onChangeQuantity,
  onDetails,
}: {
  product: Product;
  index: number;
  active: boolean;
  line?: CartLine;
  offset: number;
  onActivate: () => void;
  onAdd: () => void;
  onChangeQuantity: (delta: number) => void;
  onDetails: () => void;
}) {
  const desktopOffset = offset < 0 ? offset * 92 - 26 : offset * 92;
  const scale = active ? 1 : Math.max(0.82, 1 - Math.abs(offset) * 0.045);

  return (
    <article
      className={`group w-full shrink-0 overflow-hidden border transition-[opacity,transform,box-shadow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] lg:absolute lg:inset-y-0 lg:start-[18%] lg:w-[min(63vw,780px)] ${
        active
          ? "border-[#d69a68]/70 bg-[#3a201b] opacity-100 shadow-[0_30px_90px_rgba(0,0,0,.35)]"
          : "border-[#e7c7a3]/15 bg-[#291a17] opacity-55 hover:opacity-80"
      }`}
      style={{
        transform: `translate3d(${desktopOffset}%, 0, 0) scale(${scale})`,
        zIndex: 20 - Math.abs(offset),
        scrollSnapAlign: "start",
      }}
    >
      <div className="grid h-full min-h-[520px] grid-rows-[minmax(300px,1fr)_auto] md:min-h-[590px] lg:grid-cols-[1fr_205px] lg:grid-rows-1">
        <button
          type="button"
          onClick={onActivate}
          aria-label={`Select ${product.name}`}
          className="focus-ring relative min-h-[310px] overflow-hidden text-start lg:min-h-0"
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ objectPosition: product.imagePosition }}
            className={`absolute inset-0 h-full w-full object-cover transition duration-1000 ${active ? "grayscale-0 group-hover:scale-[1.025]" : "grayscale-[.18]"}`}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,14,12,.04),rgba(25,14,12,.8))]" />
          <div className="absolute start-5 top-5 flex items-center gap-3 font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#f0bd91] md:start-7 md:top-7">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e1a674]/60">{String(index + 1).padStart(2, "0")}</span>
            <span>{product.category}</span>
          </div>
          <div className="absolute inset-x-5 bottom-6 md:inset-x-8 md:bottom-8">
            <p className="font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#edb17e]">{product.note}</p>
            <h2 className="mt-3 max-w-[520px] font-display text-[clamp(3.2rem,8vw,7.5rem)] leading-[.78] tracking-[-.075em] text-[#fff0de]">
              {product.name}
            </h2>
          </div>
          <span className="absolute end-5 top-5 flex h-10 w-10 translate-x-2 items-center justify-center rounded-full border border-[#f4d0af]/45 text-[#f3c69d] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowUpRight size={17} />
          </span>
        </button>

        <div className="flex flex-col justify-between border-t border-[#f0d8bd]/15 bg-[#321c18] p-5 md:p-7 lg:border-s lg:border-t-0">
          <div className="flex gap-5 lg:block">
            <div className="shrink-0">
              <p className="font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#d79a68]">Tonight&apos;s plate</p>
              <p className="mt-3 font-display text-4xl leading-none text-[#f3d0ac]">{money(product.price)}</p>
            </div>
            <p className="max-w-[330px] text-sm leading-relaxed text-[#c09c89] lg:mt-9">{product.description}</p>
          </div>
          <div className="mt-7">
            <button
              type="button"
              onClick={onDetails}
              className="focus-ring flex items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[.17em] text-[#a78675] transition hover:text-[#f0bd91]"
            >
              Open the note <ChevronDown size={12} />
            </button>
            {line ? (
              <div className="mt-5 flex items-center justify-between border-t border-[#f0d8bd]/15 pt-4">
                <span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#a78675]">In your tray</span>
                <QuantityControl quantity={line.quantity} onChange={onChangeQuantity} />
              </div>
            ) : (
              <button
                type="button"
                onClick={onAdd}
                className="focus-ring mt-6 flex w-full items-center justify-between border border-[#dba16f] bg-[#dba16f] px-4 py-3.5 font-mono-ui text-[10px] font-bold uppercase tracking-[.15em] text-[#301512] transition hover:bg-[#f0bd91]"
              >
                Add this plate <Plus size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Radical() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trayOpen, setTrayOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const visibleProducts = useMemo(
    () => selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  );
  const activeProduct = visibleProducts[activeIndex] ?? visibleProducts[0];
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    setActiveIndex(0);
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

  return (
    <div className="bianco-menu min-h-screen bg-[#1b1211] text-[#f3e4d3]">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[76px] shrink-0 flex-col items-center border-e border-[#edc9aa]/15 bg-[#221513] py-5 lg:flex">
          <div className="relative flex h-10 w-10 items-center justify-center border border-[#dba16f] text-[#e2af7e]">
            <span className="absolute inset-1 border border-[#dba16f]/35" />
            <span className="font-display text-2xl italic">B</span>
          </div>
          <p className="mt-7 [writing-mode:vertical-rl] rotate-180 font-mono-ui text-[8px] uppercase tracking-[.28em] text-[#9e7667]">Madinah · 02 AM</p>
          <nav className="mt-auto flex flex-col items-center gap-5" aria-label="Menu sections">
            {categories.map((category, index) => (
              <button
                type="button"
                key={category}
                onClick={() => chooseCategory(category)}
                aria-current={selectedCategory === category ? "page" : undefined}
                className={`focus-ring group flex items-center gap-2 [writing-mode:vertical-rl] rotate-180 font-mono-ui text-[9px] uppercase tracking-[.16em] transition ${
                  selectedCategory === category ? "text-[#e7aa78]" : "text-[#8c655a] hover:text-[#d8a57c]"
                }`}
              >
                <span className={`h-5 w-px transition-all ${selectedCategory === category ? "bg-[#e7aa78]" : "bg-transparent group-hover:bg-[#d8a57c]"}`} />
                <span>{String(index).padStart(2, "0")} · {category}</span>
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setTrayOpen((open) => !open)}
            className="focus-ring mt-auto flex items-center gap-2 [writing-mode:vertical-rl] rotate-180 border border-[#dba16f]/55 px-3 py-3 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#e7b181] transition hover:bg-[#dba16f] hover:text-[#2a1411]"
          >
            Your table <ShoppingBag size={14} />
          </button>
        </aside>

        <main className="min-w-0 flex-1 pb-24">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#edc9aa]/15 bg-[#1b1211]/90 px-4 py-4 backdrop-blur-xl lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="relative flex h-8 w-8 items-center justify-center border border-[#dba16f] text-[#e2af7e]">
                <span className="absolute inset-1 border border-[#dba16f]/35" />
                <span className="font-display text-lg italic">B</span>
              </div>
              <span className="font-display text-2xl tracking-[-.04em] text-[#f5e8d8]">Bianco</span>
            </div>
            <div className="hidden items-center gap-4 lg:flex">
              <p className="font-mono-ui text-[9px] uppercase tracking-[.24em] text-[#dba16f]">The chef&apos;s route</p>
              <span className="h-px w-20 bg-[#edc9aa]/20" />
              <p className="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#86665b]">Choose a plate, follow the room</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="font-mono-ui text-[8px] uppercase tracking-[.16em] text-[#87665b]">Route</p>
                <p className="font-mono-ui text-[10px] text-[#e0b083]">{String(activeIndex + 1).padStart(2, "0")} / {String(visibleProducts.length).padStart(2, "0")}</p>
              </div>
              <button
                type="button"
                onClick={() => setTrayOpen((open) => !open)}
                className="focus-ring flex items-center gap-2 border border-[#dba16f]/60 px-3 py-2 font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#e7b181] transition hover:bg-[#dba16f] hover:text-[#2a1411] lg:hidden"
              >
                <ShoppingBag size={14} /> {cartCount}
              </button>
            </div>
          </header>

          <div className="border-b border-[#edc9aa]/15 px-4 py-4 lg:hidden">
            <label htmlFor="mobile-menu-route" className="mb-2 block font-mono-ui text-[8px] uppercase tracking-[.2em] text-[#dba16f]">Browse the route</label>
            <div className="relative">
              <select
                id="mobile-menu-route"
                value={selectedCategory}
                onChange={(event) => chooseCategory(event.target.value)}
                className="focus-ring w-full appearance-none border border-[#edc9aa]/25 bg-[#291916] px-3 py-3 font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#f0c49a]"
              >
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute end-3 top-3.5 text-[#dba16f]" />
            </div>
          </div>

          <section className="relative overflow-hidden px-4 pb-4 pt-7 lg:h-[calc(100vh-73px)] lg:min-h-[760px] lg:px-8 lg:pt-8" aria-label="Dish route">
            <div className="mb-5 flex items-end justify-between lg:mb-0 lg:absolute lg:start-8 lg:top-8 lg:z-20">
              <div>
                <p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#dba16f]">{selectedCategory === "All" ? "All pages" : selectedCategory}</p>
                <h1 className="mt-2 font-display text-4xl leading-[.85] tracking-[-.06em] text-[#f9ead9] sm:text-5xl lg:text-6xl">Follow<br /><em className="font-normal text-[#d98d60]">the plate.</em></h1>
              </div>
              <div className="hidden items-center gap-1 lg:flex">
                {visibleProducts.map((product, index) => (
                  <button
                    type="button"
                    key={product.id}
                    aria-label={`Go to ${product.name}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1 transition-all ${index === activeIndex ? "w-10 bg-[#dba16f]" : "w-3 bg-[#765047] hover:bg-[#b77a58]"}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex gap-4 overflow-x-hidden pb-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-0 lg:block lg:overflow-hidden lg:pb-0 lg:pt-24">
              {visibleProducts.map((product, index) => (
                <RouteSlide
                  key={product.id}
                  product={product}
                  index={index}
                  active={index === activeIndex}
                  offset={index - activeIndex}
                  line={cart.find((cartLine) => cartLine.product.id === product.id)}
                  onActivate={() => setActiveIndex(index)}
                  onAdd={() => addToCart(product)}
                  onChangeQuantity={(delta) => changeQuantity(product.id, delta)}
                  onDetails={() => setSelectedProduct(product)}
                />
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-[#edc9aa]/15 pt-4 lg:absolute lg:bottom-8 lg:end-8 lg:start-8 lg:mt-0">
              <p className="max-w-[230px] font-mono-ui text-[8px] uppercase leading-relaxed tracking-[.16em] text-[#89675c]">Swipe through the chef&apos;s route · tap any plate to read the note</p>
              <div className="flex items-center gap-3 text-[#dba16f]">
                <span className="font-mono-ui text-[9px] tracking-[.16em]">{String(activeIndex + 1).padStart(2, "0")}</span>
                <div className="h-px w-10 bg-[#dba16f]/50" />
                <span className="font-mono-ui text-[9px] tracking-[.16em]">{String(visibleProducts.length).padStart(2, "0")}</span>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className={`fixed inset-x-3 bottom-3 z-40 transition-transform duration-500 lg:inset-x-auto lg:bottom-5 lg:start-[calc(76px+2rem)] lg:w-[min(600px,calc(100vw-120px))] ${trayOpen ? "translate-y-0" : "translate-y-[calc(100%-62px)]"}`}>
        {trayOpen && (
          <div className="mb-3 max-h-[58vh] overflow-y-auto border border-[#dba16f]/35 bg-[#271715] p-4 shadow-[0_20px_70px_rgba(0,0,0,.45)] sm:p-5">
            <div className="mb-3 flex items-center justify-between border-b border-[#edc9aa]/15 pb-3">
              <div>
                <p className="font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#dba16f]">Your table · {cartCount} {cartCount === 1 ? "plate" : "plates"}</p>
                <p className="mt-1 font-display text-3xl leading-none text-[#f2ddc5]">Keep the route.</p>
              </div>
              <button type="button" aria-label="Collapse your table" onClick={() => setTrayOpen(false)} className="focus-ring text-[#c08d71] hover:text-[#f0bc91]"><ChevronDown size={18} /></button>
            </div>
            {cart.length === 0 ? (
              <p className="py-7 text-sm leading-relaxed text-[#a98575]">Your tray is empty. Add a plate and it will stay with you while you browse.</p>
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
        <div role="dialog" aria-modal="true" aria-label={`${selectedProduct.name} details`} className="fixed inset-0 z-50 flex items-center justify-center bg-[#110b0a]/85 p-4 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="w-full max-w-[650px] overflow-hidden border border-[#dba16f]/35 bg-[#f0e1cf] text-[#351512] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-60 sm:h-72">
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ objectPosition: selectedProduct.imagePosition }} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#351512]/75 to-transparent" />
              <button type="button" aria-label="Close details" onClick={() => setSelectedProduct(null)} className="focus-ring absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f2e1cd]/90 text-[#5f231b]"><X size={17} /></button>
              <p className="absolute bottom-5 start-5 font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#f1c89f]">{selectedProduct.category} · {selectedProduct.note}</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-5xl leading-[.82] tracking-[-.06em]">{selectedProduct.name}</h2>
                <span className="font-mono-ui text-[11px] text-[#91392b]">{money(selectedProduct.price)}</span>
              </div>
              <p className="mt-5 max-w-[480px] text-sm leading-relaxed text-[#805e50]">{selectedProduct.description}</p>
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