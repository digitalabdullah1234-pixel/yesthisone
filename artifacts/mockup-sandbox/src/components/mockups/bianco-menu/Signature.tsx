import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
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
    <div className="flex items-center border border-[#321a16]/20 bg-[#f1e5d6]">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(-1)}
        className="focus-ring p-2 text-[#6d2920] transition hover:bg-[#d9b28d] hover:text-[#31120f]"
      >
        <Minus size={12} strokeWidth={1.7} />
      </button>
      <span className="w-6 text-center font-mono-ui text-[10px] text-[#351410]">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(1)}
        className="focus-ring p-2 text-[#6d2920] transition hover:bg-[#d9b28d] hover:text-[#31120f]"
      >
        <Plus size={12} strokeWidth={1.7} />
      </button>
    </div>
  );
}

function DishEntry({
  product,
  index,
  line,
  onAdd,
  onChangeQuantity,
  onDetails,
}: {
  product: Product;
  index: number;
  line?: CartLine;
  onAdd: () => void;
  onChangeQuantity: (delta: number) => void;
  onDetails: () => void;
}) {
  return (
    <article className="group relative overflow-hidden border-b border-[#4a1b16]/15 bg-[#f4ecdf] transition-colors duration-500 hover:bg-[#f7f0e5] md:border-e">
      <div className="flex min-h-[270px] flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="mb-5 flex items-start justify-between">
            <span className="font-mono-ui text-[10px] tracking-[.18em] text-[#9c4932]">0{index + 1}</span>
            <span className="font-mono-ui text-[10px] tracking-[.08em] text-[#773027]">{money(product.price)}</span>
          </div>
          <button
            type="button"
            onClick={onDetails}
            className="focus-ring relative block h-[138px] w-full overflow-hidden text-start"
            aria-label={`View details for ${product.name}`}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ objectPosition: product.imagePosition }}
              className="h-full w-full object-cover grayscale-[.12] transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2c1110]/35 to-transparent" />
            <span className="absolute bottom-3 start-3 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#f6e8d6]">
              {product.note}
            </span>
            <span className="absolute end-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-[#ead0ae] text-[#5e211b] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight size={14} />
            </span>
          </button>
          <div className="mt-5">
            <p className="font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#a04b34]">{product.category}</p>
            <h2 className="mt-2 font-display text-[2rem] leading-[.9] tracking-[-.045em] text-[#34120f]">{product.name}</h2>
            <p className="mt-3 max-w-[330px] text-[12px] leading-relaxed text-[#805f52]">{product.description}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-[#4a1b16]/15 pt-4">
          <button
            type="button"
            onClick={onDetails}
            className="focus-ring flex items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#8b5143] transition hover:text-[#5e211b]"
          >
            Read the note <ChevronDown size={12} />
          </button>
          {line ? (
            <QuantityControl quantity={line.quantity} onChange={onChangeQuantity} />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="focus-ring flex items-center gap-2 border-b border-[#8b2d22] pb-1 font-mono-ui text-[9px] font-bold uppercase tracking-[.16em] text-[#7a261d] transition hover:border-[#d16d46] hover:text-[#bd542f]"
            >
              Add <Plus size={13} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function Signature() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderStarted, setOrderStarted] = useState(false);

  const filteredProducts = useMemo(
    () => selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  );
  const featured = products[0];
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  const addToCart = (product: Product) => {
    setOrderStarted(false);
    setCart((current) =>
      current.some((line) => line.product.id === product.id)
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { product, quantity: 1 }],
    );
  };

  const changeQuantity = (id: string, delta: number) => {
    setCart((current) =>
      current.flatMap((line) =>
        line.product.id === id
          ? line.quantity + delta > 0 ? [{ ...line, quantity: line.quantity + delta }] : []
          : [line],
      ),
    );
  };

  return (
    <div className="bianco-menu min-h-[100dvh] overflow-x-hidden bg-[#eadfce] text-[#34120f]">
      <header className="border-b border-[#f2dfc3]/20 bg-[#4d1512] text-[#f5e7d3]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center border border-[#d9a66f] text-[#e3b27b]">
              <span className="absolute inset-1 border border-[#d9a66f]/35" />
              <span className="font-display text-xl italic">B</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-none tracking-[-.04em]">Bianco</p>
              <p className="mt-1 font-mono-ui text-[8px] uppercase tracking-[.2em] text-[#d8a98a]">Madinah · kitchen notes</p>
            </div>
          </div>
          <div className="hidden items-center gap-4 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#ddbda2] sm:flex">
            <span>Notebook 07</span>
            <span className="h-4 w-px bg-[#e6bc93]/30" />
            <span>12 PM—2 AM</span>
          </div>
          <button
            type="button"
            onClick={() => document.getElementById("order-tray")?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="focus-ring flex items-center gap-2 border border-[#d9a66f]/70 px-3 py-2 font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#f0c591] transition hover:bg-[#d9a66f] hover:text-[#4d1512]"
          >
            <ShoppingBag size={14} strokeWidth={1.6} />
            <span className="hidden xs:inline">Your order</span>
            <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-5 md:px-8 md:py-8">
        <section className="relative overflow-hidden bg-[#5b1915] text-[#f5e7d3]">
          <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full border border-[#e4ae72]/20" />
          <div className="pointer-events-none absolute -end-7 -top-7 h-40 w-40 rounded-full border border-[#e4ae72]/15" />
          <div className="grid min-h-[450px] lg:grid-cols-[.8fr_1.25fr_.75fr]">
            <div className="flex flex-col justify-between border-b border-[#f0d9b8]/15 p-6 md:p-9 lg:border-b-0 lg:border-e">
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.26em] text-[#e6ae72]">Bianco · after hours</p>
                <h1 className="mt-6 max-w-[340px] font-display text-[clamp(4rem,8vw,7.8rem)] leading-[.77] tracking-[-.075em]">
                  A table<br /><em className="font-normal text-[#e6a069]">after dark.</em>
                </h1>
              </div>
              <div className="mt-10 flex items-end justify-between gap-6">
                <p className="max-w-[220px] text-sm leading-relaxed text-[#dcb9a1]">
                  A few things we make when the room gets quiet. Pick a page, then make it yours.
                </p>
                <span className="hidden font-display text-6xl leading-none text-[#e7b77d]/35 sm:block">07</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProduct(featured)}
              className="focus-ring group relative min-h-[330px] overflow-hidden text-start lg:min-h-0"
              aria-label="View Pizza Ajwa details"
            >
              <img
                src={featured.image}
                alt={featured.name}
                style={{ objectPosition: featured.imagePosition }}
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-1000 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2c0d0b] via-[#4c1712]/25 to-[#4c1712]/10" />
              <div className="absolute inset-x-6 bottom-6 md:inset-x-9 md:bottom-9">
                <p className="font-mono-ui text-[9px] uppercase tracking-[.24em] text-[#efb97e]">The page everyone dog-ears</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <h2 className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-[.82] tracking-[-.06em]">Pizza<br /><em className="font-normal text-[#f1a16e]">Ajwa.</em></h2>
                  <ArrowUpRight className="mb-1 text-[#f2c18e] transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" size={24} strokeWidth={1.3} />
                </div>
              </div>
            </button>
            <div className="flex flex-col justify-between border-t border-[#f0d9b8]/15 p-6 md:p-9 lg:border-s lg:border-t-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#e6ae72]">Featured tonight</p>
                  <p className="mt-3 font-display text-4xl leading-none text-[#f7dfc4]">{money(featured.price)}</p>
                </div>
                <span className="font-mono-ui text-[9px] text-[#dbb397]">01 / 06</span>
              </div>
              <div>
                <p className="max-w-[240px] text-sm leading-relaxed text-[#dcb9a1]">{featured.description}</p>
                <button
                  type="button"
                  onClick={() => addToCart(featured)}
                  className="focus-ring mt-7 flex w-full items-center justify-between border-t border-[#f0d9b8]/20 pt-4 font-mono-ui text-[10px] font-bold uppercase tracking-[.16em] text-[#f0be86] transition hover:text-[#fff1dc]"
                >
                  Add the signature <Plus size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0">
            <div className="flex flex-col gap-4 border-b border-[#4a1b16]/20 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#a34a34]">The working menu</p>
                <h2 className="mt-2 font-display text-4xl tracking-[-.05em] text-[#421713]">Choose your page.</h2>
              </div>
              <p className="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#956c5d]">{filteredProducts.length} dishes · prices in SAR</p>
            </div>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Menu categories">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  role="tab"
                  aria-selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className={`focus-ring whitespace-nowrap border px-4 py-2.5 font-mono-ui text-[9px] font-bold uppercase tracking-[.17em] transition ${
                    selectedCategory === category
                      ? "border-[#691e18] bg-[#691e18] text-[#f4ddc0]"
                      : "border-[#4a1b16]/20 text-[#81564a] hover:border-[#a64f36] hover:text-[#6d231c]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-5 grid border-l border-t border-[#4a1b16]/15 sm:grid-cols-2">
              {filteredProducts.map((product, index) => (
                <DishEntry
                  key={product.id}
                  product={product}
                  index={index}
                  line={cart.find((cartLine) => cartLine.product.id === product.id)}
                  onAdd={() => addToCart(product)}
                  onChangeQuantity={(delta) => changeQuantity(product.id, delta)}
                  onDetails={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </section>

          <aside id="order-tray" className="h-fit border border-[#ead1b1] bg-[#f3e7d7] lg:sticky lg:top-5">
            <div className="border-b border-[#4a1b16]/15 bg-[#ead3b7] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono-ui text-[9px] uppercase tracking-[.23em] text-[#8c3b2b]">Last page · your order</p>
                  <h2 className="mt-2 font-display text-4xl leading-none tracking-[-.05em] text-[#421713]">The tray</h2>
                </div>
                <Utensils size={19} strokeWidth={1.3} className="text-[#8d3b2c]" />
              </div>
            </div>
            <div className="min-h-[270px] p-5">
              {cart.length === 0 ? (
                <div className="flex min-h-[240px] flex-col justify-center">
                  <p className="font-display text-3xl leading-none text-[#542018]">Leave a mark.</p>
                  <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-[#89685a]">Add a plate from the notebook. We&apos;ll hold it here while you keep browsing.</p>
                  <div className="mt-8 h-px w-16 bg-[#a85438]" />
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3 border-b border-[#4a1b16]/15 pb-4">
                      <img src={product.image} alt="" style={{ objectPosition: product.imagePosition }} className="h-14 w-14 shrink-0 object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-display text-2xl leading-none text-[#542018]">{product.name}</p>
                          <button type="button" aria-label={`Remove ${product.name}`} onClick={() => changeQuantity(product.id, -quantity)} className="focus-ring text-[#986b5c] transition hover:text-[#6d231c]"><X size={14} /></button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <QuantityControl quantity={quantity} onChange={(delta) => changeQuantity(product.id, delta)} />
                          <span className="font-mono-ui text-[10px] text-[#873526]">{money(product.price * quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-[#4a1b16]/15 bg-[#e8d0b5] p-5">
              <div className="flex items-center justify-between font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#896253]">
                <span>Subtotal · {cartCount} {cartCount === 1 ? "plate" : "plates"}</span>
                <span className="text-[#6c251c]">{money(subtotal)}</span>
              </div>
              <button
                type="button"
                disabled={!cart.length}
                onClick={() => setOrderStarted(true)}
                className="focus-ring mt-5 flex w-full items-center justify-between bg-[#691e18] px-4 py-3.5 font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f8e6ce] transition hover:bg-[#812b20] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span>{orderStarted ? "Order noted — thank you" : "Review & checkout"}</span>
                {orderStarted ? <Utensils size={15} /> : <ArrowUpRight size={15} />}
              </button>
              <p className="mt-3 text-center font-mono-ui text-[8px] uppercase tracking-[.13em] text-[#986958]">Checkout securely via WhatsApp</p>
            </div>
          </aside>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#4a1b16]/20 py-6 font-mono-ui text-[9px] uppercase tracking-[.17em] text-[#986b5c] sm:flex-row sm:items-center sm:justify-between">
          <span>Bianco · Al Qiblatayn, Madinah</span>
          <span className="text-[#813024]">A late dinner, done properly.</span>
          <button type="button" onClick={() => document.getElementById("order-tray")?.scrollIntoView({ behavior: "smooth" })} className="focus-ring flex items-center gap-1 text-[#813024] transition hover:text-[#bd542f]">Open tray <ChevronRight size={13} /></button>
        </footer>
      </main>

      {selectedProduct && (
        <div role="dialog" aria-modal="true" aria-label={`${selectedProduct.name} details`} className="fixed inset-0 z-50 flex items-center justify-center bg-[#24100e]/80 p-4 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="w-full max-w-[560px] overflow-hidden border border-[#e3bd91]/30 bg-[#f0e3d2] text-[#34120f] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-52 sm:h-64">
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ objectPosition: selectedProduct.imagePosition }} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2f100e]/70 to-transparent" />
              <button type="button" aria-label="Close details" onClick={() => setSelectedProduct(null)} className="focus-ring absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f2dfc6]/90 text-[#5c211a]"><X size={17} /></button>
              <p className="absolute bottom-5 start-5 font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#f4d0a6]">{selectedProduct.category} · {selectedProduct.note}</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-5xl leading-[.85] tracking-[-.06em]">{selectedProduct.name}</h2>
                <span className="pt-1 font-mono-ui text-[11px] text-[#8c3327]">{money(selectedProduct.price)}</span>
              </div>
              <p className="mt-5 max-w-[430px] text-sm leading-relaxed text-[#805c4e]">{selectedProduct.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-[#4a1b16]/15 pt-5">
                <p className="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#966b5c]">Prepared to order</p>
                <button type="button" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="focus-ring flex items-center gap-3 bg-[#691e18] px-5 py-3 font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f8e6ce] transition hover:bg-[#812b20]">Add to order <Plus size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}