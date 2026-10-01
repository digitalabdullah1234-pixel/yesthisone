import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight, Plus, ShoppingBag, X } from "lucide-react";
import "./_group.css";

type Product = {
  id: string; name: string; price: number; description: string; category: string;
  image: string; imagePosition?: string; note: string;
};
type CartLine = { product: Product; quantity: number };

const image = (name: string) => `/__mockup/images/bianco-menu/${name}`;
const products: Product[] = [
  { id: "pizza-ajwa", name: "Pizza Ajwa", price: 54, description: "Charred tomato, fior di latte, Madinah ajwa, and a quiet hit of chili.", category: "Signature", image: image("beef-bianco-pizza.png"), imagePosition: "center 52%", note: "The house signature" },
  { id: "rose-pasta", name: "Rose Pasta", price: 48, description: "Silky rose sauce, basil oil, parmesan, and a little heat at the finish.", category: "Pasta", image: image("penne-rose.png"), imagePosition: "center 35%", note: "Best seller" },
  { id: "margherita", name: "Margherita", price: 42, description: "San Marzano tomato, mozzarella, basil, and olive oil on a blistered base.", category: "Pizza", image: image("margherita-pizza.png"), imagePosition: "center 70%", note: "A classic, sharpened" },
  { id: "truffle-mushroom", name: "Truffle Mushroom", price: 58, description: "Roasted mushrooms, fontina, black truffle, and thyme over crisp dough.", category: "Pizza", image: image("truffle-pizza.png"), imagePosition: "center 64%", note: "For late nights" },
  { id: "burrata-tomato", name: "Burrata & Tomato", price: 36, description: "Creamy burrata, ripe tomato, basil, and aged balsamic.", category: "Starters", image: image("burrata-salad.png"), imagePosition: "center 30%", note: "Start here" },
  { id: "tiramisu", name: "Tiramisu", price: 28, description: "Mascarpone cream, espresso-soaked ladyfingers, cocoa, no unnecessary drama.", category: "Dolci", image: image("funghi-risotto.png"), imagePosition: "center 78%", note: "The last word" },
];
const categories = ["All", "Signature", "Pizza", "Pasta", "Starters", "Dolci"];
const money = (value: number) => `${value} SAR`;

function ProductCard({ product, onAdd, onDetails }: { product: Product; onAdd: () => void; onDetails: () => void }) {
  return (
    <article className="product-card group relative flex flex-col overflow-hidden border border-white/[.12] bg-[#1a1210] shadow-[0_18px_55px_rgba(0,0,0,.18)]">
      <button type="button" onClick={onDetails} className="focus-ring relative block aspect-[1.12] w-full overflow-hidden text-start">
        <img src={product.image} alt={product.name} style={{ objectPosition: product.imagePosition }} className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,14,13,.08),rgba(15,14,13,.72))]" />
        <span className="absolute start-4 top-4 border border-[#f2b46d]/45 bg-[#110d0c]/75 px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#f2b46d]">{product.category}</span>
        <span className="absolute bottom-4 start-4 font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#efe8dc]/65">{product.note}</span>
        <span className="absolute bottom-3 end-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full border border-white/30 bg-[#f5eee2] text-[#210f0c] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={15} /></span>
      </button>
      <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
        <div><div className="flex items-start justify-between gap-4"><h3 className="font-display text-[2rem] leading-none tracking-[-.025em] text-[#f5eee2]">{product.name}</h3><span className="whitespace-nowrap font-mono-ui text-[11px] text-[#f2b46d]">{money(product.price)}</span></div><p className="mt-4 max-w-[28rem] text-sm leading-relaxed text-[#9c8f84]">{product.description}</p></div>
        <button type="button" onClick={onAdd} className="focus-ring mt-7 flex w-full items-center justify-between border-t border-white/[.13] pt-4 text-left text-[11px] font-semibold uppercase tracking-[.16em] text-[#f5eee2] transition-colors hover:text-[#f2b46d]"><span>Add to order</span><Plus size={16} strokeWidth={1.5} /></button>
      </div>
    </article>
  );
}

export function Current() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const filteredProducts = useMemo(() => selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory), [selectedCategory]);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const addToCart = (product: Product) => setCart((current) => current.some((line) => line.product.id === product.id) ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }]);
  return (
    <div className="bianco-menu min-h-screen bg-[#530F0C] px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-8 border-b border-[#f5eee2]/15 pb-8 md:flex-row md:items-end">
          <div><p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">02 — Shop the menu</p><h1 className="mt-4 max-w-[620px] font-display text-6xl leading-[.78] tracking-[-.06em] md:text-8xl">Choose your<br /><em className="text-[#e85d43]">damage.</em></h1></div>
          <p className="max-w-[330px] text-sm leading-relaxed text-[#f4c6ae] md:pb-1">Tap a plate to see the details. Hit add and your bag is ready for the kitchen.</p>
        </div>
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Menu">{categories.map((category) => <button type="button" key={category} onClick={() => setSelectedCategory(category)} aria-selected={selectedCategory === category} className={`focus-ring whitespace-nowrap border px-4 py-2.5 font-mono-ui text-[9px] font-bold uppercase tracking-[.17em] transition ${selectedCategory === category ? "border-[#f2b46d] bg-[#f2b46d] text-[#210f0c]" : "border-[#f5eee2]/15 text-[#f4c6ae] hover:border-[#f2b46d]/60 hover:text-[#f2b46d]"}`}>{category}</button>)}</div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} onDetails={() => setSelectedProduct(product)} />)}</div>
          <aside className="order-first border border-[#f5eee2]/15 bg-[#420b09] p-5 lg:order-last lg:sticky lg:top-24">
            <div className="flex items-center justify-between"><p className="font-mono-ui text-[9px] font-bold uppercase tracking-[.2em] text-[#f2b46d]">Your bag</p><ShoppingBag size={17} className="text-[#f2b46d]" /></div>
            {cart.length === 0 ? <div className="border-t border-[#f5eee2]/10 pt-8"><p className="font-display text-3xl">Empty for now.</p><p className="mt-3 text-sm leading-relaxed text-[#f4c6ae]">Add a plate and we’ll keep your order here while you browse.</p></div> : <div className="mt-6 space-y-3 border-t border-[#f5eee2]/10 pt-4">{cart.slice(0, 3).map(({ product, quantity }) => <div key={product.id} className="flex items-center justify-between gap-3 text-sm"><span className="truncate text-[#f4c6ae]"><b className="me-2 text-[#f2b46d]">{quantity}×</b>{product.name}</span><span className="font-mono-ui text-[10px] text-[#f5eee2]">{money(product.price * quantity)}</span></div>)}</div>}
            <div className="mt-7 flex items-end justify-between border-t border-[#f5eee2]/10 pt-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#f4c6ae]">Subtotal</span><span className="font-display text-3xl text-[#f2b46d]">{money(subtotal)}</span></div>
            <button type="button" className="mt-5 flex w-full items-center justify-between bg-[#e85d43] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#fff2df] transition hover:bg-[#f2765d]">Review &amp; checkout <ArrowUpRight size={15} /></button>
            <p className="mt-3 text-center font-mono-ui text-[8px] uppercase tracking-[.13em] text-[#d49d8a]">Checkout securely via WhatsApp</p>
          </aside>
        </div>
        <div className="mt-9 flex flex-col gap-3 border-t border-[#f5eee2]/12 pt-5 text-[10px] uppercase tracking-[.14em] text-[#d49d8a] sm:flex-row sm:items-center sm:justify-between"><span>Prices in Saudi Riyal · pickup or delivery</span><button type="button" className="flex items-center gap-2 text-[#f2b46d]">Open full bag <ChevronRight size={14} /></button></div>
      </div>
      {selectedProduct && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5" onClick={() => setSelectedProduct(null)}><div className="max-w-md border border-[#f5eee2]/20 bg-[#1a1210] p-6" onClick={(event) => event.stopPropagation()}><div className="flex justify-end"><button type="button" aria-label="Close details" onClick={() => setSelectedProduct(null)}><X size={18} /></button></div><h2 className="font-display text-4xl">{selectedProduct.name}</h2><p className="mt-4 text-sm leading-relaxed text-[#9c8f84]">{selectedProduct.description}</p><button type="button" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="mt-6 w-full bg-[#e85d43] px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em]">Add to order</button></div></div>}
    </div>
  );
}