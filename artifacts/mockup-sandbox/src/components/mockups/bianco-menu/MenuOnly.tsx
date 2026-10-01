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

type Language = "en" | "ar";

type Product = {
  id: string;
  section: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  calories?: number;
  image?: string;
  imagePosition?: string;
};

type MenuSection = {
  id: string;
  title: string;
  titleAr: string;
  products: Product[];
};

type CartLine = { product: Product; quantity: number };

const asset = (name: string) => `/__mockup/images/bianco-menu/${name}`;

const sections: MenuSection[] = [
  {
    id: "starters",
    title: "Hot Starters / Entrée",
    titleAr: "المقبلات الساخنة",
    products: [
      {
        id: "mushroom-soup",
        section: "starters",
        name: "Mushroom Soup",
        nameAr: "شوربة الفطر",
        description: "A harmonious blend of assorted mushrooms with rich Italian cream.",
        descriptionAr: "مزيج متناغم من أنواع الفطر مع الكريمة الإيطالية.",
        price: 35,
        calories: 381,
        image: asset("mushroom-soup.png"),
      },
      {
        id: "pumpkin-soup",
        section: "starters",
        name: "Pumpkin Soup",
        nameAr: "شوربة قرع العسل",
        description: "Pumpkin and carrot soup with rich cream.",
        descriptionAr: "شوربة قرع العسل مع الجزر والكريمة الغنية.",
        price: 29,
        calories: 266,
      },
      {
        id: "arancini",
        section: "starters",
        name: "Arancini",
        nameAr: "أرانشيني",
        description: "Crispy risotto balls stuffed with mozzarella and Italian herbs, served with Parmesan cream.",
        descriptionAr: "كرات الريزوتو محشية بجبنة الموزاريلا والأعشاب الإيطالية مع صوص كريمة البارميزان المميز.",
        price: 49,
        calories: 590,
        image: asset("arancini.png"),
      },
      {
        id: "chili-shrimp",
        section: "starters",
        name: "Chili Shrimp",
        nameAr: "تشيلي شرمب",
        description: "Grilled shrimp smothered in spicy chili sauce infused with fresh basil.",
        descriptionAr: "روبيان مشوي مغمور بصوص الفلفل الحار ومعطر بأوراق الريحان الطازجة.",
        price: 36,
        calories: 265,
        image: asset("chili-shrimp.png"),
      },
      {
        id: "french-fries",
        section: "starters",
        name: "French Fries",
        nameAr: "بطاطس مقلية",
        description: "French fries seasoned with Italian herbs and spices.",
        descriptionAr: "أصابع البطاطس المقلية متبلة بمزيج من البهارات الإيطالية.",
        price: 15,
        calories: 265,
        image: asset("french-fries.png"),
      },
    ],
  },
  {
    id: "salads",
    title: "Salads / Insalate",
    titleAr: "السلطات",
    products: [
      {
        id: "burrata-salad",
        section: "salads",
        name: "Burrata Salad",
        nameAr: "بوراتا سالاد",
        description: "Arugula, cherry tomatoes, burrata cheese, and Italian Bianco dressing.",
        descriptionAr: "الجرجير مع الطماطم الكرزية وجبن البوراتا مع صوص بيانكو الإيطالي.",
        price: 56,
        calories: 406,
        image: asset("burrata-salad.png"),
      },
      {
        id: "bianco-salad",
        section: "salads",
        name: "Bianco Salad",
        nameAr: "سلطة بيانكو",
        description: "Grilled chicken with fresh mixed greens, orange segments, and our signature Bianco dressing.",
        descriptionAr: "دجاج مشوي مع الورقيات الطازجة والبرتقال مع صوص بيانكو الخاص.",
        price: 42,
        calories: 410,
        image: asset("bianco-salad.png"),
      },
      {
        id: "portobello-shrimp-salad",
        section: "salads",
        name: "Portobello Shrimp Salad",
        nameAr: "سلطة البورتابلو شرمب",
        description: "Portobello mushrooms with fresh greens, avocado, shrimp, and signature seasoning.",
        descriptionAr: "سلطة فطر البورتابلو مع الورقيات الطازجة والأفوكادو والروبيان بتتبيلة مميزة.",
        price: 52,
        calories: 489,
        image: asset("portobello-shrimp-salad.png"),
      },
      {
        id: "quinoa-salad",
        section: "salads",
        name: "Quinoa Salad",
        nameAr: "سلطة الكينوا",
        description: "Red quinoa with pumpkin, beetroot, avocado, and pomegranate.",
        descriptionAr: "حبوب الكينوا الحمراء مع مزيج غني من القرع والبنجر والأفوكادو والرمان.",
        price: 45,
        calories: 388,
      },
    ],
  },
  {
    id: "pizza",
    title: "Pizza / Pizzeria",
    titleAr: "البيتزا",
    products: [
      {
        id: "margherita-pizza",
        section: "pizza",
        name: "Margherita Pizza",
        nameAr: "بيتزا مارجريتا",
        description: "San Marzano tomatoes, mozzarella, Parmesan cheese, and fresh basil.",
        descriptionAr: "طماطم السان مارزانو مع جبنة الموزاريلا والبارميزان والريحان.",
        price: 50,
        calories: 944,
        image: asset("margherita-pizza.png"),
      },
      {
        id: "diavola-pizza",
        section: "pizza",
        name: "Diavola Pizza",
        nameAr: "بيتزا ديافولا",
        description: "San Marzano tomatoes, Italian pepperoni, Italian rucola, mozzarella, and Parmesan.",
        descriptionAr: "طماطم السان مارزانو والببروني الإيطالي والجرجير الإيطالي مع الموزاريلا والبارميزان.",
        price: 62,
        calories: 980,
        image: asset("diavola-pizza.png"),
      },
      {
        id: "beef-bianco-pizza",
        section: "pizza",
        name: "Beef Bianco Pizza",
        nameAr: "بيتزا بيف بيانكو",
        description: "Creamy sauce and beef topped with mozzarella, Italian rucola, pine nuts, and Ajwa dates.",
        descriptionAr: "مزيج مميز بين صلصة الكريمة واللحم مع الموزاريلا والجرجير الإيطالي والصنوبر مع تمر العجوة.",
        price: 85,
        calories: 1387,
        image: asset("beef-bianco-pizza.png"),
      },
      {
        id: "chicken-polo-pizza",
        section: "pizza",
        name: "Chicken Polo Pizza",
        nameAr: "بيتزا تشكن بولو",
        description: "Smoked chicken pizza with creamy sauce, Portobello mushrooms, fried herbs, and fresh basil.",
        descriptionAr: "بيتزا الدجاج المدخن وصلصة الكريمة مع فطر البورتوبلو والأعشاب المقلية والريحان.",
        price: 67,
        calories: 966,
        image: asset("chicken-polo-pizza.png"),
      },
      {
        id: "truffle-pizza",
        section: "pizza",
        name: "Truffle Pizza",
        nameAr: "بيتزا ترافل",
        description: "Truffle cream pizza blended with mozzarella, fresh basil, and Parmesan cheese.",
        descriptionAr: "بيتزا كريمة الترافل متمازجة مع جبنة الموزاريلا والريحان وجبنة البارميزان.",
        price: 78,
        calories: 1050,
        image: asset("truffle-pizza.png"),
      },
      {
        id: "pesto-pizza",
        section: "pizza",
        name: "Pesto Pizza",
        nameAr: "بيتزا بيستو",
        description: "Pesto pizza with burrata cheese and cherry tomatoes.",
        descriptionAr: "بيتزا بيستو مع جبن البوراتا والطماطم الكرزية.",
        price: 68,
        calories: 1159,
      },
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    titleAr: "الباستا",
    products: [
      {
        id: "seafood-spaghetti",
        section: "pasta",
        name: "Seafood Spaghetti",
        nameAr: "اسباغيتي سي فود",
        description: "Spaghetti with Italian sauce and a delicious mix of seafood.",
        descriptionAr: "اسباغيتي مع الصلصة الإيطالية ومزيج من المأكولات البحرية الشهية.",
        price: 63,
        calories: 530,
        image: asset("seafood-spaghetti.png"),
      },
      {
        id: "penne-rose",
        section: "pasta",
        name: "Penne Rosé",
        nameAr: "بيني روز",
        description: "Penne pasta with rich cream sauce, Italian sauce, and tender chicken.",
        descriptionAr: "تناغم باستا البيني مع مزيج الكريمة الغنية والصلصة الإيطالية والدجاج.",
        price: 45,
        calories: 563,
        image: asset("penne-rose.png"),
      },
      {
        id: "rigatoni-pesto",
        section: "pasta",
        name: "Rigatoni Pesto",
        nameAr: "ريجاتوني بيستو",
        description: "Rigatoni with signature pesto cream sauce, broccoli florets, and tender chicken.",
        descriptionAr: "باستا الريجاتوني ممزوجة مع كريمة البيستو الخاص وقطع البروكلي والدجاج.",
        price: 49,
        calories: 751,
        image: asset("rigatoni-pesto.png"),
      },
      {
        id: "funghi-risotto",
        section: "pasta",
        name: "Funghi Risotto",
        nameAr: "ريزوتو فونجي",
        description: "Our signature risotto prepared with a selection of fresh mushrooms.",
        descriptionAr: "طبق الريزوتو الشهير مع خليط من الفطر الطازج.",
        price: 59,
        calories: 519,
        image: asset("funghi-risotto.png"),
      },
      {
        id: "truffle-fettuccine",
        section: "pasta",
        name: "Truffle Fettuccine",
        nameAr: "فيتوتشيني ترافل",
        description: "Fettuccine pasta tossed in a rich truffle cream sauce.",
        descriptionAr: "باستا الفيتوتشيني مع كريمة الترافل.",
        price: 52,
        calories: 637,
        image: asset("truffle-fettuccine.png"),
      },
    ],
  },
  {
    id: "mains",
    title: "Main Courses",
    titleAr: "الأطباق الرئيسية",
    products: [
      {
        id: "beef-bianco",
        section: "mains",
        name: "Beef Bianco",
        nameAr: "بيف بيانكو",
        description: "Tenderloin beef slices served with mushroom sauce and sautéed vegetables.",
        descriptionAr: "شرائح لحم التندرلوين مع صوص الفطر وخضار السوتيه.",
        price: 82,
        calories: 1210,
        image: asset("beef-bianco.png"),
      },
      {
        id: "grilled-salmon",
        section: "mains",
        name: "Grilled Salmon",
        nameAr: "جرلد سالمون",
        description: "Grilled salmon served with lemon butter sauce and sautéed vegetables.",
        descriptionAr: "سالمون مشوي بصوص الزبدة والليمون مع خضار السوتيه.",
        price: 79,
        calories: 861,
        image: asset("grilled-salmon.png"),
      },
      {
        id: "chicken-pesto-roulade",
        section: "mains",
        name: "Chicken Pesto Roulade",
        nameAr: "دجاج ملفوف محشو بالجبان",
        description: "Chicken roulade with cheese, fresh spinach, and sun-dried tomatoes, Italian style.",
        descriptionAr: "دجاج ملفوف محشو بالجبان مع السبانخ الطازجة والطماطم المجففة على الطريقة الإيطالية.",
        price: 66,
        calories: 770,
      },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    titleAr: "الحلويات",
    products: [
      {
        id: "tiramisu",
        section: "desserts",
        name: "Tiramisu",
        nameAr: "تيراميسو",
        description: "Mascarpone cream, espresso-soaked ladyfingers, and cocoa.",
        descriptionAr: "كريمة الماسكاربوني، أصابع ليدي فنجرز المنقوعة بالإسبريسو، والكاكاو.",
        price: 45,
      },
    ],
  },
  {
    id: "beverages",
    title: "Beverages",
    titleAr: "المشروبات",
    products: [
      { id: "bianco-paradiso", section: "beverages", name: "Bianco Paradiso", nameAr: "بيانكو براديسو", description: "", descriptionAr: "", price: 21, calories: 433 },
      { id: "florenza-pomegranate", section: "beverages", name: "Florenza Pomegranate", nameAr: "فلورنسا بومجرانيت", description: "", descriptionAr: "", price: 23, calories: 345 },
      { id: "festa-di-passione", section: "beverages", name: "Festa Di Passione", nameAr: "فيستا دي باشيوني", description: "", descriptionAr: "", price: 24, calories: 173 },
      { id: "orange-juice", section: "beverages", name: "Orange Juice", nameAr: "عصير برتقال", description: "", descriptionAr: "", price: 16, calories: 353 },
      { id: "flat-white", section: "beverages", name: "Flat White", nameAr: "فلات وايت", description: "", descriptionAr: "", price: 16 },
      { id: "coffee-americano", section: "beverages", name: "Coffee Americano", nameAr: "قهوة أمريكانو", description: "", descriptionAr: "", price: 14 },
      { id: "iced-americano", section: "beverages", name: "Iced Americano", nameAr: "أمريكانو بارد", description: "", descriptionAr: "", price: 14 },
      { id: "soft-drinks", section: "beverages", name: "Soft Drinks", nameAr: "مشروبات غازية", description: "", descriptionAr: "", price: 6 },
      { id: "water", section: "beverages", name: "Water", nameAr: "ماء", description: "", descriptionAr: "", price: 6 },
      { id: "mineral-water", section: "beverages", name: "Mineral Water", nameAr: "مياه معدنية", description: "", descriptionAr: "", price: 6 },
      { id: "carbonated-water", section: "beverages", name: "Carbonated Water", nameAr: "مياه غازية", description: "", descriptionAr: "", price: 8 },
    ],
  },
];

const money = (value: number) => `${value} SAR`;

function trackMenuEvent(event: string, payload?: Record<string, unknown>) {
  void event;
  void payload;
}

function QuantityControl({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex items-center border border-[#6a261d]/20 bg-[#f4e8d7]">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(-1)} className="focus-ring p-2 text-[#7b2d23] transition hover:bg-[#dcb58e] hover:text-[#421511]">
        <Minus size={12} strokeWidth={1.6} />
      </button>
      <span className="w-6 text-center font-mono-ui text-[10px] text-[#431612]">{quantity}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(1)} className="focus-ring p-2 text-[#7b2d23] transition hover:bg-[#dcb58e] hover:text-[#421511]">
        <Plus size={12} strokeWidth={1.6} />
      </button>
    </div>
  );
}

function MenuItemRow({
  product,
  language,
  line,
  onAdd,
  onChangeQuantity,
  onDetails,
}: {
  product: Product;
  language: Language;
  line?: CartLine;
  onAdd: () => void;
  onChangeQuantity: (delta: number) => void;
  onDetails: () => void;
}) {
  const isArabic = language === "ar";
  const name = isArabic ? product.nameAr : product.name;
  const description = isArabic ? product.descriptionAr : product.description;

  return (
    <article className="group border-t border-[#f0d4b8]/20 py-4 transition-colors hover:bg-[#52201b] sm:py-5">
      <div className="flex items-start gap-3 sm:items-center sm:gap-5">
        {product.image ? (
          <button type="button" onClick={onDetails} aria-label={`View details for ${product.name}`} className="focus-ring h-14 w-14 shrink-0 overflow-hidden sm:h-[68px] sm:w-[84px]">
            <img src={product.image} alt={product.name} style={{ objectPosition: product.imagePosition }} className="h-full w-full object-cover opacity-80 grayscale-[.12] transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0" />
          </button>
        ) : (
          <span className="hidden h-[1px] w-[84px] shrink-0 bg-[#dba16f]/55 sm:block" aria-hidden="true" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <button type="button" onClick={onDetails} className="focus-ring min-w-0 text-start">
              <h3 className={`font-display leading-none tracking-[-.04em] text-[#f7e7d3] transition-colors group-hover:text-[#f0bb8d] ${isArabic ? "text-[1.5rem]" : "text-[1.6rem] sm:text-[1.85rem]"}`} dir={isArabic ? "rtl" : "ltr"}>{name}</h3>
            </button>
            <span className="shrink-0 font-mono-ui text-[10px] text-[#efb27f]">{money(product.price)}</span>
          </div>
          {description && <p className={`mt-2 max-w-[720px] text-[11px] leading-relaxed text-[#dbc2ae] sm:text-[12px] ${isArabic ? "text-right" : "text-left"}`} dir={isArabic ? "rtl" : "ltr"}>{description}</p>}
          <div className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-ui text-[8px] uppercase tracking-[.13em] text-[#e0a071] ${isArabic ? "justify-end" : ""}`}>
            {product.calories !== undefined && <span>{product.calories} Cal</span>}
            {!product.description && !product.descriptionAr && <span>{isArabic ? "متوفر" : "Available"}</span>}
          </div>
        </div>
        <div className="hidden shrink-0 sm:block">
          {line ? (
            <QuantityControl quantity={line.quantity} onChange={onChangeQuantity} />
          ) : (
            <button type="button" onClick={onAdd} className="focus-ring flex items-center gap-1 border-b border-[#dba16f] pb-1 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] text-[#f0bc8d] transition hover:border-[#f0c39a] hover:text-[#ffe5ca]">
              Add <Plus size={13} />
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between ps-0 sm:hidden">
        {line ? (
          <QuantityControl quantity={line.quantity} onChange={onChangeQuantity} />
        ) : (
            <button type="button" onClick={onAdd} className="focus-ring flex items-center gap-1 border-b border-[#dba16f] pb-1 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] text-[#f0bc8d]">
            Add to order <Plus size={13} />
          </button>
        )}
        <button type="button" onClick={onDetails} className="focus-ring font-mono-ui text-[8px] uppercase tracking-[.14em] text-[#d0a991]">Details</button>
      </div>
    </article>
  );
}

export function MenuOnly() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeSection, setActiveSection] = useState("all");
  const [showAllOnAll, setShowAllOnAll] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trayOpen, setTrayOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const visibleSections = useMemo(
    () => activeSection === "all" ? sections : sections.filter((section) => section.id === activeSection),
    [activeSection],
  );
  const hiddenOnAllCount = useMemo(
    () => sections.reduce((total, section) => total + Math.max(section.products.length - 1, 0), 0),
    [],
  );
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const isArabic = language === "ar";

  const chooseSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowAllOnAll(false);
    requestAnimationFrame(() => document.getElementById(`menu-section-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const addToCart = (product: Product) => {
    trackMenuEvent("menu_item_added", { id: product.id, name: product.name, price: product.price });
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

  const openDetails = (product: Product) => {
    trackMenuEvent("menu_item_details_opened", { id: product.id, name: product.name });
    setSelectedProduct(product);
  };

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={`bianco-menu min-h-screen bg-[#421713] text-[#f3e4d3] ${isArabic ? "font-['Noto_Naskh_Arabic']" : ""}`}>
      <header className="border-b border-[#5f2119]/20 bg-[#ede2d1] text-[#4a1713]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center border border-[#7f3025] text-[#7f3025]">
              <span className="absolute inset-1 border border-[#7f3025]/35" />
              <span className="font-display text-xl italic">B</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-none tracking-[-.04em]">Bianco</p>
              <p className="mt-1 font-mono-ui text-[8px] uppercase tracking-[.2em] text-[#9f6855]">{isArabic ? "قائمة الطعام" : "Menu"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border border-[#6a261d]/20 p-1" role="group" aria-label="Language">
            <button type="button" onClick={() => setLanguage("en")} aria-pressed={!isArabic} className={`focus-ring px-2.5 py-1.5 font-mono-ui text-[9px] uppercase tracking-[.1em] transition ${!isArabic ? "bg-[#6f241c] text-[#f6e1c5]" : "text-[#8a5746] hover:text-[#6f241c]"}`}>EN</button>
            <button type="button" onClick={() => setLanguage("ar")} aria-pressed={isArabic} className={`focus-ring px-2.5 py-1.5 font-['Noto_Naskh_Arabic'] text-[12px] leading-none transition ${isArabic ? "bg-[#6f241c] text-[#f6e1c5]" : "text-[#8a5746] hover:text-[#6f241c]"}`}>عربي</button>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 border-b border-[#f0d4b8]/20 bg-[#421713]/95 backdrop-blur-md" aria-label="Menu categories">
        <div className="mx-auto flex max-w-[1180px] items-center gap-5 overflow-x-auto px-5 py-3 sm:px-8">
          <button type="button" onClick={() => chooseSection("all")} aria-current={activeSection === "all" ? "page" : undefined} className={`focus-ring shrink-0 border-b-2 pb-1 font-mono-ui text-[9px] uppercase tracking-[.15em] transition ${activeSection === "all" ? "border-[#e3a071] text-[#f5d7bb]" : "border-transparent text-[#cba28e] hover:border-[#e1a071] hover:text-[#ffe4c9]"}`}>{isArabic ? "الكل" : "All"}</button>
          {sections.map((section) => (
             <button type="button" key={section.id} onClick={() => chooseSection(section.id)} aria-current={activeSection === section.id ? "page" : undefined} className={`focus-ring shrink-0 border-b-2 pb-1 font-mono-ui text-[9px] uppercase tracking-[.15em] transition ${activeSection === section.id ? "border-[#e3a071] text-[#f5d7bb]" : "border-transparent text-[#cba28e] hover:border-[#e1a071] hover:text-[#ffe4c9]"}`}>
              {isArabic ? section.titleAr : section.title}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-[1180px] scroll-pb-40 px-5 pb-40 text-[#f3e4d3] sm:px-8">
        {visibleSections.map((section) => (
          <section id={`menu-section-${section.id}`} key={section.id} className="scroll-mt-16 border-b border-[#f0d4b8]/25 py-8 sm:py-10">
            <div className="mb-3 flex items-end justify-between border-b border-[#f0d4b8]/30 pb-4">
              <div>
                <p className="font-mono-ui text-[8px] uppercase tracking-[.23em] text-[#e3a071]">{String(sections.findIndex((item) => item.id === section.id) + 1).padStart(2, "0")}</p>
                <h1 className="mt-1 font-display text-4xl leading-none tracking-[-.05em] text-[#f8e7d4] sm:text-5xl">{isArabic ? section.titleAr : section.title}</h1>
              </div>
              <span className="font-mono-ui text-[9px] text-[#e0a071]">{section.products.length}</span>
            </div>
            {(activeSection === "all" && !showAllOnAll ? section.products.slice(0, 1) : section.products).map((product) => (
              <MenuItemRow
                key={product.id}
                product={product}
                language={language}
                line={cart.find((cartLine) => cartLine.product.id === product.id)}
                onAdd={() => addToCart(product)}
                onChangeQuantity={(delta) => changeQuantity(product.id, delta)}
                onDetails={() => openDetails(product)}
              />
            ))}
          </section>
        ))}
        {activeSection === "all" && hiddenOnAllCount > 0 && (
          <div className="flex justify-center py-8 sm:py-10">
            <button
              type="button"
              onClick={() => setShowAllOnAll((expanded) => !expanded)}
              className="focus-ring inline-flex items-center gap-3 border border-[#dba16f]/70 px-5 py-3 font-mono-ui text-[9px] font-bold uppercase tracking-[.16em] text-[#f0bc8d] transition hover:bg-[#dba16f] hover:text-[#2a1411]"
            >
              {showAllOnAll
                ? (isArabic ? "عرض أقل" : "Show less")
                : (isArabic ? `عرض المزيد · ${hiddenOnAllCount}` : `Show more · ${hiddenOnAllCount} dishes`)}
              {showAllOnAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        )}
      </main>

      <div id="menu-only-tray" className={`fixed inset-x-3 bottom-3 z-40 transition-transform duration-500 lg:inset-x-auto lg:bottom-5 lg:start-1/2 lg:w-[min(620px,calc(100vw-80px))] lg:-translate-x-1/2 ${trayOpen ? "translate-y-0" : "translate-y-[calc(100%-62px)]"}`}>
        {trayOpen && (
          <div className="mb-3 max-h-[58vh] overflow-y-auto border border-[#dba16f]/35 bg-[#271715] p-4 text-left shadow-[0_20px_70px_rgba(0,0,0,.42)] sm:p-5" dir="ltr">
            <div className="mb-3 flex items-center justify-between border-b border-[#edc9aa]/15 pb-3">
              <div>
                <p className="font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#dba16f]">YOUR TABLE · {cartCount} {cartCount === 1 ? "PLATE" : "PLATES"}</p>
                <p className="mt-1 font-display text-3xl leading-none text-[#f2ddc5]">Your order.</p>
              </div>
              <button type="button" aria-label="Collapse your table" onClick={() => setTrayOpen(false)} className="focus-ring text-[#c08d71] hover:text-[#f0bc91]"><ChevronDown size={18} /></button>
            </div>
            {cart.length === 0 ? (
              <p className="py-7 text-sm leading-relaxed text-[#a98575]">Your table is ready. Add an item from the menu and it will stay here while you browse.</p>
            ) : (
              <div className="space-y-3">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 border-b border-[#edc9aa]/10 pb-3">
                    {product.image && <img src={product.image} alt="" className="h-12 w-12 object-cover" />}
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
        <div className="flex items-center gap-3 border border-[#dba16f]/60 bg-[#dba16f] p-2 ps-4 text-[#2a1411] shadow-[0_12px_40px_rgba(0,0,0,.3)]" dir="ltr">
          <ShoppingBag size={17} />
          <div className="min-w-0 flex-1">
            <p className="font-mono-ui text-[9px] font-bold uppercase tracking-[.16em]">{cartCount ? `${cartCount} ${cartCount === 1 ? "PLATE" : "PLATES"} SELECTED` : "YOUR TABLE IS OPEN"}</p>
            <p className="font-mono-ui text-[9px] text-[#663528]">{cartCount ? `Subtotal · ${money(subtotal)}` : "Gather something good"}</p>
          </div>
          <button type="button" onClick={() => setTrayOpen((open) => !open)} className="focus-ring flex items-center gap-2 border border-[#5c281d]/35 px-3 py-2 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] transition hover:bg-[#f0bd91]">
            {trayOpen ? "CLOSE" : "OPEN TRAY"} {trayOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          <button type="button" disabled={!cart.length} onClick={() => { trackMenuEvent("checkout_started", { items: cartCount, subtotal }); setOrderConfirmed(true); setTrayOpen(true); }} className="focus-ring hidden bg-[#5d1d18] px-3 py-2 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] text-[#f8e4cc] transition hover:bg-[#742920] disabled:cursor-not-allowed disabled:opacity-35 sm:flex sm:items-center sm:gap-2">
            {orderConfirmed ? "NOTED" : "CHECKOUT"} <ArrowUpRight size={14} />
          </button>
        </div>
        {cart.length > 0 && (
          <button type="button" onClick={() => { trackMenuEvent("checkout_started", { items: cartCount, subtotal }); setOrderConfirmed(true); setTrayOpen(true); }} className="focus-ring mt-2 flex w-full items-center justify-between bg-[#5d1d18] px-4 py-3 font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] text-[#f8e4cc] transition hover:bg-[#742920] sm:hidden">
            <span>{orderConfirmed ? "ORDER NOTED — THANK YOU" : "CHECKOUT"}</span>
            {orderConfirmed ? <Utensils size={14} /> : <ArrowUpRight size={14} />}
          </button>
        )}
      </div>

      {selectedProduct && (
        <div role="dialog" aria-modal="true" aria-label={`${selectedProduct.name} details`} className="fixed inset-0 z-50 flex items-center justify-center bg-[#160b09]/75 p-4 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="w-full max-w-[620px] overflow-hidden border border-[#dba16f]/35 bg-[#f0e1cf] text-[#351512] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            {selectedProduct.image && (
              <div className="relative h-52">
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ objectPosition: selectedProduct.imagePosition }} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#351512]/75 to-transparent" />
                <button type="button" aria-label="Close details" onClick={() => setSelectedProduct(null)} className="focus-ring absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f2e1cd]/90 text-[#5f231b]"><X size={17} /></button>
              </div>
            )}
            {!selectedProduct.image && <div className="flex justify-end p-4 pb-0"><button type="button" aria-label="Close details" onClick={() => setSelectedProduct(null)} className="focus-ring text-[#5f231b]"><X size={17} /></button></div>}
            <div className="p-6 sm:p-8" dir={isArabic ? "rtl" : "ltr"}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono-ui text-[9px] uppercase tracking-[.17em] text-[#9a4b36]">{isArabic ? "تفاصيل الصنف" : "Menu item"}</p>
                  <h2 className="mt-2 font-display text-4xl leading-[.86] tracking-[-.06em]">{isArabic ? selectedProduct.nameAr : selectedProduct.name}</h2>
                </div>
                <span className="pt-1 font-mono-ui text-[11px] text-[#91392b]">{money(selectedProduct.price)}</span>
              </div>
              {(isArabic ? selectedProduct.descriptionAr : selectedProduct.description) && <p className="mt-5 text-sm leading-relaxed text-[#805e50]">{isArabic ? selectedProduct.descriptionAr : selectedProduct.description}</p>}
              <div className="mt-6 flex items-center justify-between border-t border-[#351512]/15 pt-5">
                <span className="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#966e5d]">{selectedProduct.calories !== undefined ? `${selectedProduct.calories} Cal` : isArabic ? "السعر فقط" : "No calorie listing"}</span>
                <button type="button" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="focus-ring flex items-center gap-3 bg-[#691e18] px-5 py-3 font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f7e4cc] transition hover:bg-[#843027]">{isArabic ? "أضف للطلب" : "Add to order"} <Plus size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}