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
  chapter: "Antipasti" | "Pizza" | "Pasta" | "Dolci";
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

const chapterNames: Product["chapter"][] = ["Antipasti", "Pizza", "Pasta", "Dolci"];
const filters = ["All dishes", "Signature", "Pizza", "Pasta", "Starters", "Dolci"];
const money = (value: number) => `${value} SAR`;

function QuantityControl({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex items-center border border-[#6f2a20]/20 bg-[#f4e9d8]">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(-1)}
        className="focus-ring p-2 text-[#7e3025] transition hover:bg-[#dcb68f] hover:text-[#411612]"
      >
        <Minus size={12} strokeWidth={1.6} />
      </button>
      <span className="w-6 text-center font-mono-ui text-[10px] text-[#481813]">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(1)}
        className="focus-ring p-2 text-[#7e3025] transition hover:bg-[#dcb68f] hover:text-[#411612]"
      >
        <Plus size={12} strokeWidth={1.6} />
      </button>
    </div>
  );
}

function DishRow({
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
    <article className="group border-t border-[#5f2119]/15 py-5 transition-colors duration-300 hover:bg-[#f4e9da] sm:py-6">
      <div className="flex items-center gap-3 sm:gap-5">
        <span className="w-8 shrink-0 self-start pt-1 font-mono-ui text-[9px] tracking-[.16em] text-[#a95c43] sm:w-10">{number}</span>
        <button
          type="button"
          onClick={onDetails}
          aria-label={`View details for ${product.name}`}
          className="focus-ring h-16 w-16 shrink-0 overflow-hidden text-start sm:h-[76px] sm:w-[96px]"
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ objectPosition: product.imagePosition }}
            className="h-full w-full object-cover opacity-75 grayscale-[.16] transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
          />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <button type="button" onClick={onDetails} className="focus-ring min-w-0 text-start">
              <h3 className="truncate font-display text-[clamp(1.65rem,3vw,2.6rem)] leading-[.9] tracking-[-.05em] text-[#4c1813] transition-colors group-hover:text-[#8b3327]">{product.name}</h3>
            </button>
            <span className="shrink-0 font-mono-ui text-[10px] text-[#823226] sm:hidden">{money(product.price)}</span>
          </div>
          <p className="mt-2 max-w-[600px] text-[11px] leading-relaxed text-[#806155] sm:text-[12px]">{product.description}</p>
          <p className="mt-2 font-mono-ui text-[8px] uppercase tracking-[.16em] text-[#aa654e]">{product.note}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-5 sm:flex">
          <span className="font-mono-ui text-[11px] text-[#823226]">{money(product.price)}</span>
          {line ? (
            <QuantityControl quantity={line.quantity} onChange={onChangeQuantity} />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="focus-ring flex items-center gap-1 border-b border-[#8b3327] pb-1 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] text-[#76281f] transition hover:border-[#cb6f4b] hover:text-[#b95537]"
            >
              Add <Plus size={13} />
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between ps-11 sm:hidden">
        {line ? (
          <QuantityControl quantity={line.quantity} onChange={onChangeQuantity} />
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="focus-ring flex items-center gap-1 border-b border-[#8b3327] pb-1 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] text-[#76281f]"
          >
            Add to order <Plus size={13} />
          </button>
        )}
        <button type="button" onClick={onDetails} className="focus-ring font-mono-ui text-[8px] uppercase tracking-[.14em] text-[#9d624f]">Read details</button>
      </div>
    </article>
  );
}

function FoldSection({
  chapter,
  chapterNumber,
  open,
  productsInChapter,
  cart,
  onToggle,
  onAdd,
  onChangeQuantity,
  onDetails,
}: {
  chapter: Product["chapter"];
  chapterNumber: string;
  open: boolean;
  productsInChapter: Product[];
  cart: CartLine[];
  onToggle: () => void;
  onAdd: (product: Product) => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onDetails: (product: Product) => void;
}) {
  return (
    <section id={`fold-${chapter.toLowerCase()}`} className={`scroll-mt-28 border-b border-[#5f2119]/25 ${open ? "bg-[#f0e3d2]" : "bg-[#e8dac7]"}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="focus-ring group flex w-full items-center gap-4 px-4 py-6 text-start transition-colors hover:bg-[#f4eadc] sm:px-7 sm:py-7"
      >
        <span className={`font-display text-4xl leading-none transition-colors sm:text-5xl ${open ? "text-[#a34b35]" : "text-[#bc8065]"}`}>{chapterNumber}</span>
        <span className="min-w-0 flex-1">
          <span className={`block font-mono-ui text-[8px] uppercase tracking-[.22em] ${open ? "text-[#9b4734]" : "text-[#9f6b58]"}`}>Chapter {chapterNumber}</span>
          <span className={`mt-1 block font-display text-3xl leading-none tracking-[-.05em] sm:text-4xl ${open ? "text-[#491713]" : "text-[#63251d]"}`}>{chapter}</span>
        </span>
        <span className="hidden font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#a06b57] sm:block">{productsInChapter.length} {productsInChapter.length === 1 ? "dish" : "dishes"}</span>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center border transition ${open ? "border-[#8a3528] bg-[#8a3528] text-[#f4dfc7]" : "border-[#9b5944] text-[#8a3528] group-hover:bg-[#d8ae87]"}`}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-7 sm:px-7 sm:pb-9">
          <div className="mb-5 flex items-center justify-between border-t border-[#5f2119]/15 pt-4">
            <p className="font-mono-ui text-[8px] uppercase tracking-[.19em] text-[#9f604c]">Prepared in the kitchen · choose your plate</p>
            <span className="font-mono-ui text-[9px] text-[#a06b57]">{productsInChapter.length} entries</span>
          </div>
          {productsInChapter.length ? (
            <div>
              {productsInChapter.map((product, index) => (
                <DishRow
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
          ) : (
            <p className="py-10 text-sm text-[#896656]">Nothing is showing in this chapter for the selected filter.</p>
          )}
          <div className="mt-7 flex items-center gap-4 border-t border-[#5f2119]/15 pt-5">
            <img
              src={image(chapter === "Antipasti" ? "burrata-salad.png" : chapter === "Pasta" ? "penne-rose.png" : "margherita-pizza.png")}
              alt=""
              className="h-14 w-20 object-cover opacity-65"
            />
            <p className="max-w-[420px] font-display text-lg leading-tight text-[#733025]">A small note from the table: {chapter === "Dolci" ? "leave room for the last word." : "take your time with the middle."}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export function TableMenu() {
  const [selectedFilter, setSelectedFilter] = useState("All dishes");
  const [openChapter, setOpenChapter] = useState<Product["chapter"]>("Antipasti");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trayOpen, setTrayOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const filteredProducts = useMemo(
    () => selectedFilter === "All dishes" ? products : products.filter((product) => product.category === selectedFilter),
    [selectedFilter],
  );
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  const chooseFilter = (filter: string) => {
    setSelectedFilter(filter);
    const matched = products.find((product) => filter === "All dishes" || product.category === filter);
    if (matched) {
      setOpenChapter(matched.chapter);
      requestAnimationFrame(() => document.getElementById(`fold-${matched.chapter.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const chooseChapter = (chapter: Product["chapter"]) => {
    setSelectedFilter("All dishes");
    setOpenChapter(chapter);
    requestAnimationFrame(() => document.getElementById(`fold-${chapter.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
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
    <div className="bianco-menu min-h-screen bg-[#ede2d1] text-[#4a1713]">
      <header className="border-b border-[#5f2119]/20 bg-[#ede2d1]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center border border-[#7f3025] text-[#7f3025]">
              <span className="absolute inset-1 border border-[#7f3025]/35" />
              <span className="font-display text-xl italic">B</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-none tracking-[-.04em]">Bianco</p>
              <p className="mt-1 font-mono-ui text-[8px] uppercase tracking-[.2em] text-[#9f6855]">Madinah · table menu 07</p>
            </div>
          </div>
          <div className="hidden items-center gap-5 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#966551] sm:flex">
            <span>12 PM—2 AM</span>
            <span className="h-4 w-px bg-[#6b271e]/25" />
            <span>Pickup · delivery</span>
          </div>
          <button
            type="button"
            onClick={() => { setTrayOpen(true); document.getElementById("table-menu-tray")?.scrollIntoView({ behavior: "smooth" }); }}
            className="focus-ring flex items-center gap-2 border border-[#8a3528] px-3 py-2 font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#76281f] transition hover:bg-[#76281f] hover:text-[#f3e0c8]"
          >
            <ShoppingBag size={14} /> <span className="hidden sm:inline">Your table</span> {cartCount}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 pb-36 sm:px-8">
        <section className="border-b border-[#5f2119]/25 py-8 sm:py-11">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono-ui text-[9px] uppercase tracking-[.26em] text-[#a34d37]">Bianco · the table is set</p>
              <h1 className="mt-4 font-display text-[clamp(3.8rem,8vw,7rem)] leading-[.78] tracking-[-.08em] text-[#4b1713]">Dinner,<br /><em className="font-normal text-[#a34d37]">unfolded.</em></h1>
            </div>
            <p className="max-w-[270px] text-sm leading-relaxed text-[#795447] sm:pb-1">A short menu for long evenings. Open a chapter, choose a plate, and keep the table moving.</p>
          </div>
        </section>

        <nav className="sticky top-0 z-20 -mx-5 border-b border-[#5f2119]/20 bg-[#ede2d1]/95 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8" aria-label="Menu filters">
          <div className="flex items-center justify-between gap-5">
            <p className="hidden shrink-0 font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#a34d37] md:block">Open a fold</p>
            <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto">
              {filters.map((filter, index) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => chooseFilter(filter)}
                  aria-current={selectedFilter === filter ? "page" : undefined}
                  className={`focus-ring shrink-0 border-b-2 pb-1 font-mono-ui text-[9px] uppercase tracking-[.14em] transition ${
                    selectedFilter === filter ? "border-[#8a3528] text-[#72271e]" : "border-transparent text-[#9c6b57] hover:border-[#c27656] hover:text-[#7f3025]"
                  }`}
                >
                  {String(index).padStart(2, "0")} · {filter}
                </button>
              ))}
            </div>
            <span className="hidden shrink-0 font-mono-ui text-[9px] text-[#9c6b57] sm:block">{filteredProducts.length} plates</span>
          </div>
        </nav>

        <section className="mt-8 border border-[#5f2119]/25 bg-[#e7d8c5] shadow-[0_18px_50px_rgba(74,23,19,.08)]">
          <div className="flex items-center justify-between border-b border-[#5f2119]/20 px-4 py-3 font-mono-ui text-[8px] uppercase tracking-[.2em] text-[#9d624f] sm:px-7">
            <span>Bianco · cucina italiana</span>
            <span>Turn the page slowly</span>
          </div>
          {chapterNames.map((chapter, index) => (
            <FoldSection
              key={chapter}
              chapter={chapter}
              chapterNumber={`0${index + 1}`}
              open={openChapter === chapter}
              productsInChapter={filteredProducts.filter((product) => product.chapter === chapter)}
              cart={cart}
              onToggle={() => chooseChapter(chapter)}
              onAdd={addToCart}
              onChangeQuantity={changeQuantity}
              onDetails={setSelectedProduct}
            />
          ))}
        </section>

        <footer className="flex flex-col gap-3 border-t border-[#5f2119]/20 py-7 font-mono-ui text-[9px] uppercase tracking-[.17em] text-[#9e6c59] sm:flex-row sm:items-center sm:justify-between">
          <span>Bianco · Al Qiblatayn, Madinah</span>
          <span className="text-[#843126]">A late dinner, done properly.</span>
          <span>Daily · 12 PM—2 AM</span>
        </footer>
      </main>

      <div id="table-menu-tray" className={`fixed inset-x-3 bottom-3 z-40 transition-transform duration-500 lg:inset-x-auto lg:bottom-5 lg:start-1/2 lg:w-[min(620px,calc(100vw-80px))] lg:-translate-x-1/2 ${trayOpen ? "translate-y-0" : "translate-y-[calc(100%-62px)]"}`}>
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
              <p className="py-7 text-sm leading-relaxed text-[#a98575]">Your table is ready. Add something from the menu and it will stay here while you read.</p>
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