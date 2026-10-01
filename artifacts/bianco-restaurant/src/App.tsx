import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { trackEvent } from '@/lib/analytics';
import { isMenuCutoutImage, resolveMenuImage } from '@/lib/menu-images';
import {
  getGetCartQueryKey,
  getGetMenuQueryKey,
  type CartResponse,
  type MenuCategory,
  type MenuItem,
  useGetCart,
  useGetMenu,
  usePutCart,
} from '@workspace/api-client-react';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const listingUrl = 'https://maps.app.goo.gl/X1aurWpXUuXSdWzP8';
const mapsEmbed = 'https://www.google.com/maps?q=Abo+Bakr+Al+Siddiq,+Al+Qiblatayn,+Madinah+42351,+Saudi+Arabia&output=embed';
const mapsPhoto = 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm83Up9qihXIoG9ZDosn8hLq66NWL-kPgGwdvkhmeY-sVYhuOrIQsgIcjzy2SthVYGTLZhRPQvYsAgEoTvVYM3MlMgOl5lptxb7toRNIQFDKDr22Whd_142fiUJQU9n4n4oCyKQ6OpHFrw=w1200-h800-k-no';
const mapsPhotoPortrait = 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmP0e7c4hB3BZ9VRFsuiAG71wFetpD92S1nxkBJ6XJfp9aZ8UIXKt8S3c8u0MFGFubnoV9q7C4YZXWjlNAw8R_P6flmlQPQnYWVKjV0BVbUBwqEPNDIu9-uhVC0H4DAu6dDfsmQ67yATLHF=w900-h1200-k-no';
const heroImage = `${import.meta.env.BASE_URL}bianco-interior-hero.jpg`;
const loadingHandImage = `${import.meta.env.BASE_URL}bianco-sabar-hand.png`;
const phoneNumber = '+966 55 994 9069';
const whatsappNumber = '966559949069';
const menuPath = '#order';

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

type MenuHighlight = {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  arabicCategory: string;
  image: string;
};

type CartLine = {
  product: Product;
  quantity: number;
};

type Locale = 'en' | 'ar';
type Translate = (key: string) => string;

const ui: Record<Locale, Record<string, string>> = {
  en: {
    madinah: 'Madinah', menu: 'Menu', energy: 'The room', findUs: 'Find us', maps: 'Maps',
    reserve: 'Reserve a table', callForTable: 'Call for a table', bag: 'Your bag', closeMenu: 'Close menu', openMenu: 'Open menu',
    openCart: 'Open cart with {count} items', location: 'Al Qiblatayn, Madinah', terrace: 'Terrace & dining room',
    dailyHours: 'Daily 12 PM — 2 AM', cuisine: 'Cucina Italiana', heroHello: 'Buonasera,', heroCity: 'Madinah.',
    heroFooterLeft: 'Italian dining · Madinah', heroFooterCenter: 'Open daily', heroFooterRight: '12 PM — 2 AM',
    heroDescription: 'Pizza, pasta, and long Italian dinners, on the terrace or in the dining room. Tables are reserved by phone.',
    viewMenu: 'View the menu', reservationsPhone: 'Reservations by phone', addOrder: 'Add to order',
    menuGalleryLabel: '01 — From the menu', menuGalleryTitle: 'Made to be seen.', menuGalleryText: 'A few plates from our Italian kitchen. Keep scrolling — there is more to come.',
    allCategories: 'All', showMore: 'Show more', showLess: 'Show less', yourCart: 'Your Cart',
    cartEyebrow: 'Your table, to go', cartTitle: 'Your order', closeCart: 'Close cart',
    emptyTitle: 'Nothing on the table yet.', emptyText: 'Add a signature, a little something to share, and we will get it moving.',
    browseMenu: 'Browse the menu', itemsDelivery: 'items · for pickup or delivery', estimatedSubtotal: 'Estimated subtotal',
    whatsappOrder: 'Order via WhatsApp', preferCall: 'Prefer to call?', kitchen: 'From the Bianco kitchen',
    closeDetails: 'Close product details', reservationText: 'Call with your party size and preferred time to check availability and confirm your reservation with our team.',
    call: 'Call', openDaily: 'Open daily · 12 PM — 2 AM', shopMenu: '02 — The Bianco menu',
    chooseYour: 'Made for', damage: 'long evenings.', menuIntro: 'A few favourites from the Bianco table. Find your dish, then add it to your order.',
    emptyNow: 'Empty for now.', emptySummary: 'Add a plate and we’ll keep your order here while you browse.',
    more: 'more', subtotal: 'Subtotal', reviewCheckout: 'Review & checkout', secureWhatsapp: 'Checkout securely via WhatsApp',
    prices: 'Prices in Saudi Riyal · pickup or delivery', fullBag: 'Open full bag', energyLabel: '03 — The room',
    trayOpen: 'Open tray', trayClose: 'Close tray', checkout: 'Checkout', selected: 'selected', tableOpen: 'Your table is open', addToTable: 'Add a plate and your table will hold it here.',
    storyHeadingA: 'Not a', storyHeadingB: 'quiet', storyHeadingC: 'room.',
    storyLead: 'Bianco means white. The evening is anything but.',
    storyBody: 'We built this Italian room for the in-between hours: the late dinner after a long day, the table that keeps ordering, the plate passed across the room without asking.',
    googleRating: 'Google rating', lastOrder: 'Last order', galleryLabel: '04 — Step inside', roomA: 'The', roomB: 'room.',
    galleryCaption: 'The glow, the clatter, the last forkful.', visitLabel: '05 — Come find us',
    doorA: 'The door', doorB: 'is open.', address: 'Abo Bakr Al Siddiq\nAl Qiblatayn, Madinah 42351\nSaudi Arabia',
    everyDay: 'Every day', googleMaps: 'Open in Google Maps', orderLoud: 'Order loud.', eatWell: 'Eat well.',
    whatsappKitchen: 'WhatsApp the kitchen', followRoom: 'Follow the room', footerHours: '12 PM — 2 AM · Every day',
    reservationEyebrow: 'Bianco, Madinah', mapArea: 'Al Qiblatayn', countryShort: 'KSA',
    heroAlt: "Bianco's dining room viewed from above, with tall columns and hanging lights",
    pickupMessage: "Hello Bianco, I'd like to order:", estimatedTotal: 'Estimated total',
    emptyOrderMessage: 'Hello Bianco, I would like to place an order.', currency: 'SAR',
     remove: 'Remove', decrease: 'Decrease', increase: 'Increase', featured: 'Featured', loadingMenu: 'Loading menu', menuError: 'The menu is taking a moment.', menuErrorText: 'Please try again. The kitchen catalog could not be reached.', retry: 'Try again', menuEmpty: 'The menu is quiet.', menuEmptyText: 'There are no available dishes at the moment.', cartUpdateError: 'We could not update your basket. Please try again.', cartError: 'Your basket could not be loaded. Please try again.',
    gallery0: 'Bianco dining room from the Google Maps listing', gallery1: 'A closer look inside Bianco',
    gallery2: 'The Bianco room after dark', gallery3: 'Warm details from the restaurant',
  },
  ar: {
    madinah: 'المدينة المنورة', menu: 'القائمة', energy: 'أجواء المكان', findUs: 'موقعنا', maps: 'الخرائط',
    reserve: 'احجز طاولة', callForTable: 'اتصل لحجز طاولة', bag: 'طلبك', closeMenu: 'إغلاق القائمة', openMenu: 'فتح القائمة',
    openCart: 'فتح السلة وبها {count} عناصر', location: 'القبلتين، المدينة المنورة', terrace: 'التراس وصالة الطعام',
    dailyHours: 'يومياً 12 ظهراً — 2 صباحاً', cuisine: 'مطبخ إيطالي', heroHello: 'مساء الخير،', heroCity: 'المدينة.',
    heroFooterLeft: 'تجربة إيطالية · المدينة', heroFooterCenter: 'مفتوح يومياً', heroFooterRight: '12 ظهراً — 2 صباحاً',
    heroDescription: 'بيتزا وباستا وعشاء إيطالي طويل، في التراس أو صالة الطعام. الحجز عبر الهاتف.',
    viewMenu: 'شاهد القائمة', reservationsPhone: 'الحجز عبر الهاتف', addOrder: 'أضف إلى الطلب',
    menuGalleryLabel: '01 — من القائمة', menuGalleryTitle: 'أطباق تستحق أن تُرى.', menuGalleryText: 'مختارات من مطبخنا الإيطالي. واصل التمرير — هناك المزيد.',
    allCategories: 'الكل', showMore: 'عرض المزيد', showLess: 'عرض أقل', yourCart: 'سلتك',
    cartEyebrow: 'مائدتك، أينما كنت', cartTitle: 'طلبك', closeCart: 'إغلاق السلة',
    emptyTitle: 'مائدتك فارغة حتى الآن.', emptyText: 'أضف طبقاً مميزاً أو شيئاً للمشاركة وسنتولى الباقي.',
    browseMenu: 'تصفح القائمة', itemsDelivery: 'عناصر · للاستلام أو التوصيل', estimatedSubtotal: 'المجموع التقديري',
    whatsappOrder: 'اطلب عبر واتساب', preferCall: 'تفضل الاتصال؟', kitchen: 'من مطبخ بيانكو',
    closeDetails: 'إغلاق تفاصيل الطبق', reservationText: 'اتصل بنا مع عدد الضيوف والوقت المفضل للتحقق من التوفر وتأكيد حجزك مع فريقنا.',
    call: 'اتصل', openDaily: 'مفتوح يومياً · 12 ظهراً — 2 صباحاً', shopMenu: '02 — قائمة بيانكو',
    chooseYour: 'نكهاتٌ تُحكى', damage: 'على مهل.', menuIntro: 'أطباق مختارة من مائدة بيانكو. اختر طبقك وأضفه إلى طلبك.',
    emptyNow: 'فارغة الآن.', emptySummary: 'أضف طبقاً وسنحتفظ بطلبك هنا أثناء التصفح.',
    more: 'إضافية', subtotal: 'المجموع', reviewCheckout: 'راجع وأكمل الطلب', secureWhatsapp: 'إتمام الطلب بأمان عبر واتساب',
    prices: 'الأسعار بالريال السعودي · استلام أو توصيل', fullBag: 'افتح السلة كاملة', energyLabel: '03 — أجواء المكان',
    trayOpen: 'افتح مائدتك', trayClose: 'أغلق مائدتك', checkout: 'إتمام الطلب', selected: 'مختارة', tableOpen: 'مائدتك مفتوحة', addToTable: 'أضف طبقاً وسنحتفظ به هنا أثناء التصفح.',
    storyHeadingA: 'ليست', storyHeadingB: 'هادئة', storyHeadingC: 'هذه الصالة.',
    storyLead: 'بيانكو تعني الأبيض، لكن المساء هنا مليء بالألوان.',
    storyBody: 'صممنا هذه الصالة الإيطالية لساعات المساء: عشاء متأخر بعد يوم طويل، مائدة تستمر في الطلب، وطبق يمر بين الأصدقاء بلا تكلف.',
    googleRating: 'تقييم جوجل', lastOrder: 'آخر طلب', galleryLabel: '04 — ادخل إلى عالمنا', roomA: 'هذه', roomB: 'الصالة.',
    galleryCaption: 'الضوء الدافئ، صوت المكان، واللقمة الأخيرة.', visitLabel: '05 — تفضل بزيارتنا',
    doorA: 'الباب', doorB: 'مفتوح.', address: 'طريق أبو بكر الصديق\nالقبلتين، المدينة المنورة 42351\nالمملكة العربية السعودية',
    everyDay: 'كل يوم', googleMaps: 'افتح في خرائط جوجل', orderLoud: 'اطلب بشغف.', eatWell: 'وكل جيداً.',
    whatsappKitchen: 'راسل المطبخ عبر واتساب', followRoom: 'تابع أجواءنا', footerHours: '12 ظهراً — 2 صباحاً · يومياً',
    reservationEyebrow: 'بيانكو، المدينة المنورة', mapArea: 'القبلتين', countryShort: 'السعودية',
    heroAlt: 'صالة بيانكو من الأعلى بأعمدتها الطويلة وإضاءتها المعلقة',
    pickupMessage: 'مرحباً بيانكو، أود طلب:', estimatedTotal: 'المجموع التقديري',
    emptyOrderMessage: 'مرحباً بيانكو، أود تقديم طلب.', currency: 'ر.س',
     remove: 'حذف', decrease: 'تقليل', increase: 'زيادة', featured: 'مميز', loadingMenu: 'جارٍ تحميل القائمة', menuError: 'القائمة تحتاج لحظة.', menuErrorText: 'تعذر الوصول إلى قائمة المطبخ. حاول مرة أخرى.', retry: 'حاول مرة أخرى', menuEmpty: 'القائمة هادئة الآن.', menuEmptyText: 'لا توجد أطباق متاحة في الوقت الحالي.', cartUpdateError: 'تعذر تحديث طلبك. حاول مرة أخرى.', cartError: 'تعذر تحميل طلبك. حاول مرة أخرى.',
    gallery0: 'صالة بيانكو من صور خرائط جوجل', gallery1: 'نظرة أقرب داخل بيانكو',
    gallery2: 'صالة بيانكو في المساء', gallery3: 'تفاصيل دافئة من المطعم',
  },
};

const productArabic: Record<string, Pick<Product, 'name' | 'description' | 'category' | 'note'>> = {};
const products: Product[] = [];
const menuHighlights: MenuHighlight[] = [];

function productText(product: Product, _locale: Locale) {
  return product;
}

const gallery = [
  { src: mapsPhoto, altKey: 'gallery0', className: 'md:col-span-2 md:row-span-2' },
  { src: mapsPhotoPortrait, altKey: 'gallery1', className: '' },
  { src: mapsPhoto, altKey: 'gallery2', className: '' },
  { src: mapsPhotoPortrait, altKey: 'gallery3', className: 'md:col-span-2' },
];

const categories: string[] = [];

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function formatPrice(value: number, locale: Locale) {
  return locale === 'ar' ? `${new Intl.NumberFormat('ar-SA').format(value)} ر.س` : `${value} SAR`;
}

function ProductCard({
  product,
  onAdd,
  onDetails,
  locale,
  t,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  onDetails: (product: Product) => void;
  locale: Locale;
  t: Translate;
}) {
  const text = productText(product, locale);
  const isDishPhoto = product.image.includes('/menu-dishes/');
  const isCutoutPhoto = isMenuCutoutImage(product.image);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`card-product-${product.id}`}
      className="product-card group relative flex min-w-0 flex-col overflow-hidden border border-[#2e2924]/15 bg-[#fbf1df] text-[#241b17] shadow-[0_16px_36px_rgba(38,18,12,.12)]"
    >
      <button type="button" onClick={() => { trackEvent('product_viewed', { product_id: product.id, product_name: product.name, category: product.category }); onDetails(product); }} data-testid={`button-details-${product.id}`} className="focus-ring relative block aspect-square w-full overflow-hidden bg-[#fbf1df] text-start">
        {isDishPhoto ? (
          <img src={product.image} alt={text.name} loading="lazy" style={{ objectPosition: product.imagePosition }} className={`h-full w-full transition duration-700 group-hover:scale-105 ${isCutoutPhoto ? 'object-contain p-4 drop-shadow-[0_16px_18px_rgba(59,27,19,.18)]' : 'object-cover'}`} />
        ) : (
          <div className="menu-card-placeholder h-full w-full px-6 py-5" aria-hidden="true">
            <span className="font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#765044]">Bianco / Madinah</span>
            <span className="mt-10 block max-w-[11rem] font-display text-[2.15rem] leading-[.85] text-[#491d17]">{text.name}</span>
          </div>
        )}
        {!isCutoutPhoto && <div className={`absolute inset-0 ${isDishPhoto ? 'bg-[linear-gradient(180deg,rgba(15,14,13,0),rgba(15,14,13,.68))]' : 'bg-[linear-gradient(180deg,rgba(255,247,229,0),rgba(66,28,20,.08))]'}`} />}
        <span className={`absolute start-4 top-4 border px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[.16em] backdrop-blur-sm ${isDishPhoto && !isCutoutPhoto ? 'border-[#f7dfb2]/60 bg-[#241310]/70 text-[#f7dfb2]' : 'border-[#6c3b2d]/25 bg-[#fff3de]/85 text-[#6c3b2d]'}`}>{text.category}</span>
        {isDishPhoto && <span className={`absolute bottom-4 start-4 font-mono-ui text-[9px] uppercase tracking-[.15em] ${isCutoutPhoto ? 'text-[#765b4e]' : 'text-[#fff2df]/80'}`}>{text.note}</span>}
        <span className={`absolute bottom-4 end-4 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${isDishPhoto && !isCutoutPhoto ? 'border-white/40 bg-[#fbf1df] text-[#271510]' : 'border-[#6c3b2d]/25 bg-[#fff3de] text-[#491d17]'}`}><ArrowUpRight size={13} /></span>
      </button>
      <div className="flex flex-1 flex-col justify-between p-5 md:p-5">
        <div>
          <div className="flex items-start justify-between gap-3 border-b border-[#6c3b2d]/15 pb-3">
            <h3 data-testid={`text-product-name-${product.id}`} className="max-w-[12rem] font-display text-[1.85rem] leading-[.88] tracking-[-.025em] text-[#3a211b]">{text.name}</h3>
            <motion.span key={product.price} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} data-testid={`text-product-price-${product.id}`} className="whitespace-nowrap pt-1 font-mono-ui text-[10px] text-[#9b4f2b]">{formatPrice(product.price, locale)}</motion.span>
          </div>
          <p data-testid={`text-product-description-${product.id}`} className="mt-4 max-w-[28rem] text-[13px] leading-[1.55] text-[#765b4e]">{text.description}</p>
        </div>
        <button type="button" onClick={() => onAdd(product)} data-testid={`button-add-${product.id}`} className="focus-ring mt-6 flex w-full items-center justify-between border-t border-[#6c3b2d]/20 pt-4 text-left text-[10px] font-semibold uppercase tracking-[.16em] text-[#5e291f] transition-colors hover:text-[#a34e2e]">
          <span>{t('addOrder')}</span><span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#9b4f2b]/35"><Plus size={14} strokeWidth={1.5} /></span>
        </button>
      </div>
    </motion.article>
  );
}

function MenuHighlights({ locale, t }: { locale: Locale; t: Translate }) {
  const isArabic = locale === 'ar';
  const repeatedDishes = [...menuHighlights, ...menuHighlights];

  return (
    <section aria-labelledby="menu-highlights-heading" className="menu-highlights overflow-hidden border-y border-[#f5eee2]/15 bg-[#530F0C]">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">{t('menuGalleryLabel')}</p>
            <h2 id="menu-highlights-heading" className="mt-4 max-w-[560px] font-display text-5xl leading-[.84] tracking-[-.05em] text-[#fff2df] md:text-7xl">{t('menuGalleryTitle')}</h2>
          </div>
          <p className="max-w-[330px] text-sm leading-relaxed text-[#f4c6ae]">{t('menuGalleryText')}</p>
        </div>
      </div>

      <div className="menu-highlights-window border-y border-[#f5eee2]/15 py-5" aria-label={t('menuGalleryTitle')}>
        <div className="menu-highlights-track flex w-max gap-4 px-5">
          {repeatedDishes.map((dish, index) => {
            const dishName = isArabic ? dish.arabicName : dish.name;
            const category = isArabic ? dish.arabicCategory : dish.category;
            return (
              <figure key={`${dish.id}-${index}`} className="menu-highlight-card group relative w-[230px] shrink-0 overflow-hidden border border-[#f5eee2]/20 bg-[#420b09] md:w-[280px]">
                <div className="aspect-square overflow-hidden">
                  <img src={dish.image} alt={dishName} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#210604]/85 via-transparent to-transparent" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-[#fff2df]">
                  <p className="font-mono-ui text-[8px] uppercase tracking-[.17em] text-[#f2b46d]">{category}</p>
                  <p className="mt-1 font-display text-[1.65rem] leading-none">{dishName}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CartDrawer({
  cart,
  subtotal,
  onClose,
  onUpdateQuantity,
  onRemove,
  locale,
  t,
}: {
  cart: CartLine[];
  subtotal: number;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  locale: Locale;
  t: Translate;
}) {
  const orderMessage = cart.length
    ? `${t('pickupMessage')}\n${cart.map(({ product, quantity }) => `${quantity} × ${productText(product, locale).name}`).join('\n')}\n${t('estimatedTotal')}: ${formatPrice(subtotal, locale)}`
    : t('emptyOrderMessage');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
  const drawerX = locale === 'ar' ? '-100%' : '100%';

  return (
    <AnimatePresence>
      <motion.div key="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#080706]/75 backdrop-blur-[3px]" onClick={onClose} data-testid="overlay-cart" />
      <motion.aside key="cart-panel" initial={{ x: drawerX }} animate={{ x: 0 }} exit={{ x: drawerX }} transition={{ type: 'spring', damping: 30, stiffness: 260 }} onClick={(event) => event.stopPropagation()} data-testid="panel-cart" className={`fixed inset-y-0 z-[70] flex w-full max-w-[475px] flex-col bg-[#1a1210] text-[#f5eee2] shadow-2xl ${locale === 'ar' ? 'left-0 border-r border-white/[.13]' : 'right-0 border-l border-white/[.13]'}`}>
        <div className="flex items-center justify-between border-b border-white/[.12] px-5 py-5 md:px-7">
          <div><p className="font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#f2b46d]">{t('cartEyebrow')}</p><h2 data-testid="text-cart-heading" className="mt-1 font-display text-4xl leading-none">{t('cartTitle')}</h2></div>
          <button type="button" onClick={onClose} aria-label={t('closeCart')} data-testid="button-close-cart" className="focus-ring rounded-full border border-white/15 p-2.5 text-[#c4b7a9] transition hover:border-[#f2b46d] hover:text-[#f2b46d]"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-7">
          {cart.length === 0 ? (
              <div data-testid="empty-cart" className="flex min-h-[52vh] flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#f2b46d]/35 text-[#f2b46d]"><ShoppingBag size={24} strokeWidth={1.2} /></div>
              <p className="font-display text-3xl">{t('emptyTitle')}</p>
              <p className="mt-3 max-w-[250px] text-sm leading-relaxed text-[#a9a097]">{t('emptyText')}</p>
              <button type="button" onClick={onClose} data-testid="button-empty-cart-browse" className="mt-8 border-b border-[#e8c78e] pb-1 font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#e8c78e]">{t('browseMenu')}</button>
            </div>
          ) : (
            <div className="space-y-1">
              <p data-testid="text-cart-count" className="mb-5 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#a9a097]">{cart.reduce((sum, line) => sum + line.quantity, 0)} {t('itemsDelivery')}</p>
              {cart.map(({ product, quantity }) => (
                <motion.div layout key={product.id} data-testid={`row-cart-${product.id}`} className="flex gap-4 border-t border-white/[.11] py-5">
                  {product.image.includes('/menu-dishes/') ? <img src={product.image} alt="" className={`h-20 w-20 shrink-0 ${isMenuCutoutImage(product.image) ? 'bg-[#fbf1df] object-contain p-1' : 'object-cover opacity-80'}`} style={{ objectPosition: product.imagePosition }} /> : <div className="menu-card-placeholder h-20 w-20 shrink-0" aria-hidden="true" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3"><p className="font-display text-2xl leading-none">{productText(product, locale).name}</p><button type="button" onClick={() => onRemove(product.id)} aria-label={`${t('remove')} ${productText(product, locale).name}`} data-testid={`button-remove-${product.id}`} className="text-[#8f867c] transition hover:text-[#e8c78e]"><Trash2 size={15} /></button></div>
                    <p className="mt-2 font-mono-ui text-[10px] text-[#e8c78e]">{formatPrice(product.price, locale)}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-white/[.16]">
                        <button type="button" onClick={() => onUpdateQuantity(product.id, -1)} aria-label={`${t('decrease')} ${productText(product, locale).name}`} data-testid={`button-decrease-${product.id}`} className="p-2 text-[#c6bdb2] transition hover:text-[#e8c78e]"><Minus size={13} /></button>
                        <motion.span key={quantity} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} data-testid={`text-quantity-${product.id}`} className="min-w-8 text-center font-mono-ui text-[11px]">{quantity}</motion.span>
                        <button type="button" onClick={() => onUpdateQuantity(product.id, 1)} aria-label={`${t('increase')} ${productText(product, locale).name}`} data-testid={`button-increase-${product.id}`} className="p-2 text-[#c6bdb2] transition hover:text-[#e8c78e]"><Plus size={13} /></button>
                      </div>
                      <span data-testid={`text-line-total-${product.id}`} className="font-mono-ui text-[11px] text-[#efe8dc]">{formatPrice(product.price * quantity, locale)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-white/[.12] bg-[#1c1917] px-5 py-5 md:px-7">
          <div className="flex items-center justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#a9a097]">{t('estimatedSubtotal')}</span><motion.span key={subtotal} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} data-testid="text-cart-subtotal" className="font-display text-3xl">{formatPrice(subtotal, locale)}</motion.span></div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => { if (cart.length > 0) trackEvent('checkout_intent', { method: 'whatsapp', item_count: cart.reduce((sum, line) => sum + line.quantity, 0), subtotal }); }} data-testid="link-checkout-whatsapp" className={`mt-5 flex items-center justify-between bg-[#e8c78e] px-5 py-4 text-[11px] font-semibold uppercase tracking-[.14em] text-[#171513] transition hover:bg-[#f0d7a9] ${cart.length === 0 ? 'pointer-events-none opacity-40' : ''}`}><span>{t('whatsappOrder')}</span><ArrowUpRight size={16} /></a>
          <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} onClick={() => trackEvent('phone_order_intent', { item_count: cart.reduce((sum, line) => sum + line.quantity, 0), subtotal })} data-testid="link-checkout-call" className="mt-3 flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-[.15em] text-[#a9a097] transition hover:text-[#e8c78e]"><Phone size={13} /> {t('preferCall')} {phoneNumber}</a>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function ProductDetailModal({ product, onClose, onAdd, locale, t }: { product: Product; onClose: () => void; onAdd: (product: Product) => void; locale: Locale; t: Translate }) {
  const text = productText(product, locale);
  const isDishPhoto = product.image.includes('/menu-dishes/');
  const isCutoutPhoto = isMenuCutoutImage(product.image);
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#080706]/80 p-4 backdrop-blur-sm" data-testid="modal-product-backdrop">
        <motion.div initial={{ opacity: 0, y: 22, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} onClick={(event) => event.stopPropagation()} className="relative grid w-full max-w-[880px] overflow-hidden border border-white/[.14] bg-[#1a1816] md:grid-cols-[.9fr_1.1fr]" data-testid={`modal-product-${product.id}`}>
          <div className={`relative min-h-[290px] md:min-h-[520px] ${isCutoutPhoto ? 'bg-[#f1e5d2]' : ''}`}>{isDishPhoto ? <img src={product.image} alt={text.name} className={`absolute inset-0 h-full w-full ${isCutoutPhoto ? 'object-contain p-8' : 'object-cover opacity-80'}`} style={{ objectPosition: product.imagePosition }} /> : <div className="menu-card-placeholder absolute inset-0 p-6"><span className="font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#765044]">Bianco / in the room</span><span className="mt-10 block max-w-[12rem] font-display text-5xl leading-[.85] text-[#491d17]">{text.name}</span></div>}{!isCutoutPhoto && <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-transparent to-transparent" />}<span className={`absolute bottom-5 start-5 font-mono-ui text-[9px] uppercase tracking-[.18em] ${isCutoutPhoto ? 'text-[#6c3b2d]' : 'text-[#e8c78e]'}`}>{text.category} · {text.note}</span></div>
          <div className="flex flex-col justify-between p-6 md:p-10"><button type="button" onClick={onClose} aria-label={t('closeDetails')} data-testid="button-close-product-modal" className="absolute end-4 top-4 rounded-full border border-white/15 p-2 text-[#c6bdb2] transition hover:border-[#e8c78e] hover:text-[#e8c78e]"><X size={17} /></button><div><p className="font-mono-ui text-[10px] uppercase tracking-[.22em] text-[#e8c78e]">{t('kitchen')}</p><h2 data-testid={`text-modal-name-${product.id}`} className="mt-5 max-w-[380px] font-display text-6xl leading-[.88] tracking-[-.03em] text-[#efe8dc]">{text.name}</h2><p data-testid={`text-modal-description-${product.id}`} className="mt-7 max-w-[390px] text-base leading-relaxed text-[#b8afa5]">{text.description}</p></div><div className="mt-12"><p data-testid={`text-modal-price-${product.id}`} className="font-mono-ui text-xs text-[#e8c78e]">{formatPrice(product.price, locale)}</p><button type="button" onClick={() => { onAdd(product); onClose(); }} data-testid={`button-modal-add-${product.id}`} className="mt-5 flex w-full items-center justify-between bg-[#e8c78e] px-5 py-4 text-[11px] font-semibold uppercase tracking-[.16em] text-[#171513] transition hover:bg-[#f0d7a9]"><span>{t('addOrder')}</span><Plus size={16} /></button></div></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function menuImage(path: string | null) {
  return resolveMenuImage(path);
}

function itemName(item: MenuItem, locale: Locale) {
  return locale === 'ar' ? item.nameAr : item.nameEn;
}

function itemDescription(item: MenuItem, locale: Locale) {
  return locale === 'ar' ? item.descriptionAr : item.descriptionEn;
}

function orderedCategories(categories: MenuCategory[]) {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

function orderedItems(category: MenuCategory) {
  return category.items.filter((item) => item.available).sort((a, b) => a.sortOrder - b.sortOrder);
}

function ApiMenuHighlights({
  categories,
  locale,
  t,
  onSelect,
}: {
  categories: MenuCategory[];
  locale: Locale;
  t: Translate;
  onSelect: (item: MenuItem) => void;
}) {
  const items = orderedCategories(categories).flatMap((category) => orderedItems(category).filter((item) => item.featured).map((item) => ({ item, category }))).slice(0, 6);
  const repeatedItems = [...items, ...items];
  if (!items.length) return null;
  return (
    <section aria-labelledby="menu-highlights-heading" className="overflow-hidden border-y border-[#f5eee2]/15 bg-[#530f0c]">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#e8bd82]">{t('menuGalleryLabel')}</p>
            <h2 id="menu-highlights-heading" className="mt-4 max-w-[560px] font-display text-5xl leading-[.84] tracking-[-.05em] text-[#fff2df] md:text-7xl">{t('menuGalleryTitle')}</h2>
          </div>
          <p className="max-w-[330px] text-sm leading-relaxed text-[#f4c6ae]">{t('menuGalleryText')}</p>
        </div>
      </div>
      <div className="menu-highlights-window border-y border-[#f5eee2]/15 py-5" aria-label={t('menuGalleryTitle')}>
        <div className="menu-highlights-track flex w-max gap-4 px-5">
          {repeatedItems.map(({ item, category }, index) => {
            const isDuplicate = index >= items.length;
            const image = menuImage(item.imagePath);
            const isCutoutPhoto = isMenuCutoutImage(image);
            return (
              <button type="button" key={`${item.id}-${index}`} onClick={() => onSelect(item)} aria-hidden={isDuplicate} tabIndex={isDuplicate ? -1 : undefined} data-testid={`button-featured-${item.id}${isDuplicate ? '-duplicate' : ''}`} className={`menu-highlight-card group relative h-[230px] w-[230px] shrink-0 overflow-hidden border text-start md:h-[280px] md:w-[280px] ${isCutoutPhoto ? 'border-[#6c3b2d]/20 bg-[#f1e5d2]' : 'border-[#f5eee2]/20 bg-[#420b09]'}`}>
                {image ? <img src={image} alt={itemName(item, locale)} loading="lazy" className={`absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105 ${isCutoutPhoto ? 'object-contain p-5 drop-shadow-[0_14px_18px_rgba(59,27,19,.18)]' : 'object-cover opacity-65 group-hover:opacity-85'}`} /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(232,189,130,.22),transparent_35%),linear-gradient(135deg,#681b16,#2d0808)]" aria-hidden="true" />}
                {!isCutoutPhoto && <div className="absolute inset-0 bg-gradient-to-t from-[#210604] via-[#210604]/20 to-transparent" />}
                <div className={`relative flex h-full flex-col justify-between p-5 ${isCutoutPhoto ? 'text-[#3a211b]' : 'text-[#fff2df]'}`}>
                  <span className={`font-mono-ui text-[9px] uppercase tracking-[.18em] ${isCutoutPhoto ? 'text-[#9b4f2b]' : 'text-[#e8bd82]'}`}>{String((index % items.length) + 1).padStart(2, '0')} · {locale === 'ar' ? category.titleAr : category.titleEn}</span>
                  <span><span className="block font-display text-[2rem] leading-none">{itemName(item, locale)}</span><span className={`mt-2 block font-mono-ui text-[10px] ${isCutoutPhoto ? 'text-[#765b4e]' : 'text-[#f7d8be]'}`}>{formatPrice(item.price, locale)}</span></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ApiMenuItem({
  item,
  category,
  locale,
  t,
  onAdd,
  onDetails,
}: {
  item: MenuItem;
  category: MenuCategory;
  locale: Locale;
  t: Translate;
  onAdd: (item: MenuItem) => void;
  onDetails: (item: MenuItem) => void;
}) {
  const image = menuImage(item.imagePath);
  const isCutoutPhoto = isMenuCutoutImage(image);
  return (
    <motion.article layout initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} data-testid={`card-menu-item-${item.id}`} className="group grid gap-4 border-b border-[#63372b]/16 py-5 sm:grid-cols-[112px_1fr_auto] sm:items-center sm:gap-5">
      <button type="button" onClick={() => onDetails(item)} data-testid={`button-menu-details-${item.id}`} className={`focus-ring relative aspect-square overflow-hidden text-start ${isCutoutPhoto ? 'bg-transparent' : 'bg-[#ead7bd]'}`}>
        {image ? <img src={image} alt={itemName(item, locale)} loading="lazy" className={`h-full w-full transition duration-700 group-hover:scale-105 ${isCutoutPhoto ? 'object-contain p-1.5 drop-shadow-[0_8px_10px_rgba(59,27,19,.16)]' : 'object-cover'}`} /> : <div className="menu-image-empty h-full w-full p-3" aria-hidden="true"><span className="font-mono-ui text-[8px] uppercase tracking-[.18em] text-[#814331]">Bianco</span><span className="mt-4 block font-display text-xl leading-none text-[#612c21]">{itemName(item, locale)}</span></div>}
      </button>
      <button type="button" onClick={() => onDetails(item)} data-testid={`button-menu-copy-${item.id}`} className="focus-ring text-start">
        <p className="font-mono-ui text-[8px] uppercase tracking-[.16em] text-[#9b4f2b]">{locale === 'ar' ? category.titleAr : category.titleEn}{item.featured ? ` · ${t('featured')}` : ''}</p>
        <h3 className="mt-2 font-display text-[1.8rem] leading-[.9] tracking-[-.025em] text-[#351e19]">{itemName(item, locale)}</h3>
        <p className="mt-2 max-w-[35rem] text-[13px] leading-[1.45] text-[#67473c]">{itemDescription(item, locale)}</p>
        {item.calories !== null && <p className="mt-2 font-mono-ui text-[9px] uppercase tracking-[.1em] text-[#9b7869]">{item.calories} kcal</p>}
      </button>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <span className="font-mono-ui text-[11px] text-[#8c4028]">{formatPrice(item.price, locale)}</span>
        <button type="button" onClick={() => onAdd(item)} data-testid={`button-menu-add-${item.id}`} className="focus-ring flex items-center gap-2 border border-[#8d4a32]/35 px-3 py-2 font-mono-ui text-[9px] font-bold uppercase tracking-[.12em] text-[#612c21] transition hover:border-[#612c21] hover:bg-[#612c21] hover:text-[#f8ead6]"><Plus size={13} /> {t('addOrder')}</button>
      </div>
    </motion.article>
  );
}

function ApiMenuDetailModal({ item, category, onClose, onAdd, locale, t }: { item: MenuItem; category?: MenuCategory; onClose: () => void; onAdd: (item: MenuItem) => void; locale: Locale; t: Translate }) {
  const image = menuImage(item.imagePath);
  const isCutoutPhoto = isMenuCutoutImage(image);
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#080706]/80 p-4 backdrop-blur-sm" data-testid="modal-menu-backdrop">
        <motion.div initial={{ opacity: 0, y: 22, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} onClick={(event) => event.stopPropagation()} className="relative grid max-h-[90vh] w-full max-w-[860px] overflow-y-auto border border-white/[.14] bg-[#1a1816] md:grid-cols-[.9fr_1.1fr]" data-testid={`modal-menu-item-${item.id}`}>
          <div className={`relative min-h-[270px] md:min-h-[480px] ${isCutoutPhoto ? 'bg-[#f1e5d2]' : ''}`}>{image ? <img src={image} alt={itemName(item, locale)} className={`absolute inset-0 h-full w-full ${isCutoutPhoto ? 'object-contain p-8' : 'object-cover opacity-80'}`} /> : <div className="menu-image-empty absolute inset-0 p-6"><span className="font-mono-ui text-[9px] uppercase tracking-[.22em] text-[#765044]">Bianco / {locale === 'ar' ? 'من المطبخ' : 'from the kitchen'}</span><span className="mt-10 block max-w-[12rem] font-display text-5xl leading-[.85] text-[#491d17]">{itemName(item, locale)}</span></div>}{!isCutoutPhoto && <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-transparent to-transparent" />}</div>
          <div className="flex flex-col justify-between p-6 md:p-10"><button type="button" onClick={onClose} aria-label={t('closeDetails')} data-testid="button-close-menu-modal" className="absolute end-4 top-4 rounded-full border border-white/15 p-2 text-[#c6bdb2] transition hover:border-[#e8c78e] hover:text-[#e8c78e]"><X size={17} /></button><div><p className="font-mono-ui text-[10px] uppercase tracking-[.22em] text-[#e8c78e]">{category ? (locale === 'ar' ? category.titleAr : category.titleEn) : t('kitchen')}</p><h2 className="mt-5 max-w-[380px] font-display text-6xl leading-[.88] tracking-[-.03em] text-[#efe8dc]">{itemName(item, locale)}</h2><p className="mt-7 max-w-[390px] text-base leading-relaxed text-[#b8afa5]">{itemDescription(item, locale)}</p>{item.calories !== null && <p className="mt-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#9c8f84]">{item.calories} kcal</p>}</div><div className="mt-12"><p className="font-mono-ui text-xs text-[#e8c78e]">{formatPrice(item.price, locale)}</p><button type="button" onClick={() => { onAdd(item); onClose(); }} data-testid={`button-modal-menu-add-${item.id}`} className="mt-5 flex w-full items-center justify-between bg-[#e8c78e] px-5 py-4 text-[11px] font-semibold uppercase tracking-[.16em] text-[#171513] transition hover:bg-[#f0d7a9]"><span>{t('addOrder')}</span><Plus size={16} /></button></div></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MenuNotice({ kind, t, onRetry }: { kind: 'loading' | 'error' | 'empty'; t: Translate; onRetry?: () => void }) {
  if (kind === 'loading') return <div className="grid gap-4 md:grid-cols-2" aria-label={t('loadingMenu')}><div className="menu-skeleton h-40" /><div className="menu-skeleton h-40" /><div className="menu-skeleton h-40" /></div>;
  if (kind === 'error') return <div role="alert" data-testid="status-menu-error" className="border border-[#8d4a32]/25 bg-[#f6ead8] p-8 text-[#612c21]"><p className="font-display text-3xl">{t('menuError')}</p><p className="mt-2 text-sm text-[#765044]">{t('menuErrorText')}</p>{onRetry && <button type="button" onClick={onRetry} data-testid="button-menu-retry" className="mt-5 border-b border-[#612c21] pb-1 font-mono-ui text-[10px] uppercase tracking-[.15em]">{t('retry')}</button>}</div>;
  return <div data-testid="status-menu-empty" className="border border-dashed border-[#8d4a32]/30 bg-[#f6ead8] p-10 text-center"><p className="font-display text-4xl text-[#612c21]">{t('menuEmpty')}</p><p className="mt-2 text-sm text-[#765044]">{t('menuEmptyText')}</p></div>;
}

function ApiBasketTray({ cart, locale, t, trayOpen, onToggle, onUpdate, mutationError, cartError, whatsappUrl }: { cart: CartResponse | undefined; locale: Locale; t: Translate; trayOpen: boolean; onToggle: () => void; onUpdate: (itemId: string, delta: number) => void; mutationError: boolean; cartError: boolean; whatsappUrl: string }) {
  const cartCount = cart?.items.reduce((sum, line) => sum + line.quantity, 0) ?? 0;
  const subtotal = cart?.subtotal ?? 0;
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 lg:inset-x-auto lg:bottom-5 lg:start-1/2 lg:w-[min(680px,calc(100vw-80px))] lg:-translate-x-1/2" data-testid="menu-tray">
      {trayOpen && <div className="tray-panel mb-3 max-h-[58vh] overflow-y-auto border border-[#c98b5d]/40 bg-[#2a1714] p-4 text-left shadow-[0_18px_60px_rgba(38,14,10,.32)] sm:p-5" dir={locale === 'ar' ? 'rtl' : 'ltr'} data-testid="tray-panel">
        <div className="mb-2 flex items-center justify-between border-b border-[#edc9aa]/15 pb-3"><div><p className="font-mono-ui text-[9px] uppercase tracking-[.2em] text-[#dba16f]">{t('cartEyebrow')}</p><p className="mt-1 font-display text-2xl text-[#f3dfca]">{t('cartTitle')} <span className="font-mono-ui text-[10px] text-[#a98575]">· {cartCount}</span></p></div><button type="button" aria-label={t('trayClose')} onClick={onToggle} data-testid="button-tray-close" className="focus-ring text-[#dba16f]"><ChevronDown size={17} /></button></div>
        {mutationError && <p role="alert" data-testid="status-cart-mutation-error" className="border border-[#e8bd82]/30 bg-[#491511] px-3 py-2 text-xs text-[#f5d3b5]">{t('cartUpdateError')}</p>}
        {cartError ? <div role="alert" data-testid="status-cart-error" className="py-8 text-center"><ShoppingBag className="mx-auto mb-3 text-[#dba16f]" size={24} /><p className="font-display text-2xl text-[#f3dfca]">{t('cartError')}</p></div> : !cart ? <div className="space-y-3 py-6"><div className="menu-skeleton h-14" /><div className="menu-skeleton h-14" /></div> : cart.items.length ? cart.items.map(({ item, quantity }) => <div key={item.id} className="flex items-center gap-3 border-b border-[#edc9aa]/10 py-3"><div className="h-12 w-12 shrink-0 overflow-hidden bg-[#5b2921]">{menuImage(item.imagePath) ? <img src={menuImage(item.imagePath)!} alt="" className="h-full w-full object-cover opacity-90" /> : <span className="block p-2 font-display text-xs text-[#f3dfca]">{itemName(item, locale)}</span>}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate font-display text-xl text-[#f3dfca]">{itemName(item, locale)}</p><span className="font-mono-ui text-[10px] text-[#e2aa79]">{formatPrice(item.price * quantity, locale)}</span></div><div className="mt-2 flex items-center gap-2"><button type="button" aria-label={`${t('decrease')} ${itemName(item, locale)}`} onClick={() => onUpdate(item.id, -1)} data-testid={`button-tray-decrease-${item.id}`} className="focus-ring border border-[#edc9aa]/25 p-1.5 text-[#dba16f]"><Minus size={11} /></button><span className="w-5 text-center font-mono-ui text-[10px] text-[#f3dfca]" data-testid={`text-tray-quantity-${item.id}`}>{quantity}</span><button type="button" aria-label={`${t('increase')} ${itemName(item, locale)}`} onClick={() => onUpdate(item.id, 1)} data-testid={`button-tray-increase-${item.id}`} className="focus-ring border border-[#edc9aa]/25 p-1.5 text-[#dba16f]"><Plus size={11} /></button></div></div></div>) : <div data-testid="empty-cart" className="py-8 text-center"><ShoppingBag className="mx-auto mb-3 text-[#dba16f]" size={24} /><p className="font-display text-2xl text-[#f3dfca]">{t('emptyNow')}</p><p className="mt-2 text-sm text-[#c39b83]">{t('emptySummary')}</p></div>}
        {cartCount > 0 && <><div className="flex items-center justify-between border-t border-[#edc9aa]/15 pt-4 text-[#f3dfca]"><span className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#c39b83]">{t('subtotal')}</span><span className="font-display text-2xl">{formatPrice(subtotal, locale)}</span></div><a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('checkout_intent', { method: 'whatsapp', item_count: cartCount, subtotal })} className="focus-ring mt-4 flex items-center justify-between bg-[#5d1d18] px-4 py-3 font-mono-ui text-[9px] font-bold uppercase tracking-[.12em] text-[#f8e4cc] transition hover:bg-[#7a2b20]" data-testid="tray-checkout-link"><span>{t('checkout')}</span><ArrowUpRight size={13} /></a></>}
      </div>}
      <div className="flex items-center gap-2 border border-[#dba16f]/70 bg-[#dba16f] p-2 ps-3 text-[#2a1411] shadow-[0_12px_40px_rgba(0,0,0,.3)]" dir={locale === 'ar' ? 'rtl' : 'ltr'}><ShoppingBag size={15} strokeWidth={1.7} /><div className="min-w-0 flex-1"><p className="font-mono-ui text-[8px] font-bold uppercase tracking-[.14em]">{cartCount ? `${cartCount} · ${t('cartTitle')}` : t('tableOpen')}</p>{cartCount > 0 && <p className="font-mono-ui text-[8px] text-[#663528]">{t('estimatedSubtotal')} · {formatPrice(subtotal, locale)}</p>}</div><button type="button" onClick={onToggle} data-testid="button-open-tray" aria-expanded={trayOpen} className="focus-ring flex items-center gap-1 border border-[#5c281d]/35 px-2.5 py-2 font-mono-ui text-[8px] font-bold uppercase tracking-[.12em]">{trayOpen ? t('trayClose') : t('trayOpen')} <ChevronDown size={12} className={trayOpen ? '' : 'rotate-180'} /></button><a href={cartCount ? whatsappUrl : undefined} onClick={() => cartCount && trackEvent('checkout_intent', { method: 'whatsapp', item_count: cartCount, subtotal })} aria-disabled={!cartCount} data-testid="button-tray-checkout" className={`focus-ring flex items-center gap-1 bg-[#5d1d18] px-2.5 py-2 font-mono-ui text-[8px] font-bold uppercase tracking-[.08em] text-[#f8e4cc] transition hover:bg-[#7a2b20] ${cartCount ? '' : 'pointer-events-none opacity-35'}`}><span>{t('checkout')}</span><ArrowUpRight size={12} /></a></div>
    </div>
  );
}

function ReservationDialog({ open, onOpenChange, t }: { open: boolean; onOpenChange: (open: boolean) => void; t: Translate }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-reservation" className="reserve-dialog w-[calc(100%-2rem)] max-w-[430px] gap-0 rounded-none border border-white/25 bg-[#530F0C] p-3 text-white shadow-[0_40px_120px_rgba(0,0,0,.6)] sm:rounded-none">
        <div className="relative border border-white/[.18] px-6 py-9 text-center sm:px-9 sm:py-11">
          <span aria-hidden="true" className="quiet-hero-corner -left-[5px] -top-[5px]" />
          <span aria-hidden="true" className="quiet-hero-corner -right-[5px] -top-[5px]" />
          <span aria-hidden="true" className="quiet-hero-corner -bottom-[5px] -left-[5px]" />
          <span aria-hidden="true" className="quiet-hero-corner -bottom-[5px] -right-[5px]" />
          <p className="quiet-hero-serif text-[.64rem] uppercase tracking-[.4em] text-white/70">{t('reservationEyebrow')}</p>
          <DialogTitle data-testid="text-reservation-heading" className="quiet-hero-serif mt-4 text-[2.6rem] font-normal leading-[1] tracking-[-.01em] text-white">{t('reserve')}</DialogTitle>
          <div aria-hidden="true" className="quiet-hero-diamonds mt-6 flex items-center justify-center gap-4">
            <span className="quiet-hero-rule" /><span className="quiet-hero-diamond" /><span className="quiet-hero-diamond" /><span className="quiet-hero-diamond" /><span className="quiet-hero-rule" />
          </div>
          <DialogDescription data-testid="text-reservation-description" className="quiet-hero-serif mx-auto mt-6 max-w-[21rem] text-[1.08rem] leading-[1.6] text-white/85">{t('reservationText')}</DialogDescription>
          <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} onClick={() => trackEvent('reservation_call_intent', { location: 'dialog' })} data-testid="link-reservation-call" className="quiet-hero-cta focus-ring mt-8 flex items-center justify-center gap-3 border border-white px-6 py-4 text-[.7rem] uppercase tracking-[.26em] text-white"><Phone size={14} strokeWidth={1.6} /> {t('call')} {phoneNumber}</a>
          <p className="quiet-hero-serif mt-6 text-[.62rem] uppercase tracking-[.3em] text-white/60">{t('openDaily')}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      aria-label={`Loading Bianco ${progress}%`}
      className="loading-screen fixed inset-0 z-[100] flex items-center justify-center px-6 text-[#fff2df]"
    >
      <div className="flex w-full max-w-[680px] flex-col items-center">
        <div className="loading-hand-frame">
          <img
            src={loadingHandImage}
            alt=""
            aria-hidden="true"
            className="loading-hand-base"
            draggable={false}
          />
          <div
            className="loading-hand-active"
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
            aria-hidden="true"
          >
            <img src={loadingHandImage} alt="" className="loading-hand-active-image" draggable={false} />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[340px] items-center justify-between font-mono-ui text-[9px] uppercase tracking-[.3em] text-white/55">
          <span>Bianco</span>
          <span data-testid="text-loading-progress">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

function readBiancoCartId() {
  const stored = window.localStorage.getItem('bianco-cart-id');
  if (stored) return stored;
  const created = typeof window.crypto?.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (digit) => {
      const random = Math.floor(Math.random() * 16);
      return (digit === 'x' ? random : (random & 0x3) | 0x8).toString(16);
    });
  window.localStorage.setItem('bianco-cart-id', created);
  return created;
}

function Home() {
  const reactQueryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [locale, setLocale] = useState<Locale>(() => new URLSearchParams(window.location.search).get('lang') === 'ar' || window.localStorage.getItem('bianco-locale') === 'ar' ? 'ar' : 'en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(() => window.scrollY > 12);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allMenuExpanded, setAllMenuExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [menuEntered, setMenuEntered] = useState(false);
  const [cartId] = useState(readBiancoCartId);
  const [cartMutationError, setCartMutationError] = useState(false);
  const t: Translate = (key) => ui[locale][key] ?? ui.en[key] ?? key;
  const isArabic = locale === 'ar';
  const menuQuery = useGetMenu({ query: { queryKey: getGetMenuQueryKey() } });
  const cartQuery = useGetCart(cartId, { query: { queryKey: getGetCartQueryKey(cartId) } });
  const putCart = usePutCart();
  const menuCategories = useMemo(() => orderedCategories(menuQuery.data?.categories ?? []).filter((category) => orderedItems(category).length > 0), [menuQuery.data]);
  const activeCategory = selectedCategory === 'all' ? undefined : menuCategories.find((category) => category.id === selectedCategory);
  const isAllMenu = selectedCategory === 'all' || !activeCategory;
  const visibleItems = activeCategory ? orderedItems(activeCategory) : [];
  const hiddenAllMenuItems = menuCategories.reduce((count, category) => count + Math.max(0, orderedItems(category).length - 1), 0);

  useEffect(() => {
    let progress = 0;
    let finishTimer: number | undefined;
    const progressTimer = window.setInterval(() => {
      progress = Math.min(100, progress + 2);
      setLoadProgress(progress);
      if (progress >= 100) {
        window.clearInterval(progressTimer);
        finishTimer = window.setTimeout(() => setIsLoading(false), 500);
      }
    }, 36);

    return () => {
      window.clearInterval(progressTimer);
      if (finishTimer) window.clearTimeout(finishTimer);
    };
  }, []);

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 12);
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    if (menuCategories.length && selectedCategory !== 'all' && !menuCategories.some((category) => category.id === selectedCategory)) {
      setSelectedCategory('all');
      setAllMenuExpanded(false);
    }
  }, [menuCategories, selectedCategory]);

  useEffect(() => {
    window.localStorage.setItem('bianco-locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    return () => {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    };
  }, [locale, isArabic]);

  useEffect(() => {
    const menuSection = document.getElementById('order');
    if (!menuSection) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setMenuEntered(entry.isIntersecting);
        if (!entry.isIntersecting) setTrayOpen(false);
      },
      { rootMargin: '-18% 0px -42% 0px' },
    );
    observer.observe(menuSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading || Boolean(selectedProduct) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isLoading, trayOpen, menuEntered, selectedProduct]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTrayOpen(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const cart = cartQuery.data;
  const cartCount = cart?.items.reduce((sum, line) => sum + line.quantity, 0) ?? 0;
  const subtotal = cart?.subtotal ?? 0;
  const orderMessage = cart?.items.length
    ? `${t('pickupMessage')}\n${cart.items.map(({ item, quantity }) => `${quantity} × ${itemName(item, locale)}`).join('\n')}\n${t('estimatedTotal')}: ${formatPrice(subtotal, locale)}`
    : t('emptyOrderMessage');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

  const saveCart = (items: { itemId: string; quantity: number }[]) => {
    setCartMutationError(false);
    putCart.mutate({ cartId, data: { items } }, {
      onSuccess: (nextCart) => reactQueryClient.setQueryData(getGetCartQueryKey(cartId), nextCart),
      onError: () => setCartMutationError(true),
    });
  };

  const addToCart = (item: MenuItem) => {
    const items = cart?.items.map(({ item: cartItem, quantity }) => ({ itemId: cartItem.id, quantity })) ?? [];
    const existing = items.find((line) => line.itemId === item.id);
    const nextItems = existing ? items.map((line) => line.itemId === item.id ? { ...line, quantity: Math.min(99, line.quantity + 1) } : line) : [...items, { itemId: item.id, quantity: 1 }];
    saveCart(nextItems);
    trackEvent('product_added_to_bag', { product_id: item.id, product_name: item.nameEn, price: item.price });
    setTrayOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    if (!cart) return;
    const nextItems = cart.items.flatMap(({ item, quantity }) => item.id === id ? (quantity + delta > 0 ? [{ itemId: item.id, quantity: Math.min(99, quantity + delta) }] : []) : [{ itemId: item.id, quantity }]);
    saveCart(nextItems);
  };

  const closeMenu = () => setMenuOpen(false);
  const openReservation = (location: string) => {
    trackEvent('reservation_started', { location });
    setReservationOpen(true);
  };

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen progress={loadProgress} />}</AnimatePresence>
      <main dir={isArabic ? 'rtl' : 'ltr'} className={`grain min-h-[100dvh] bg-[#110d0c] text-[#f5eee2] ${isArabic ? 'locale-ar' : ''}`}>
      <header data-scrolled={hasScrolled ? 'true' : 'false'} className="site-header fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl">
        <div dir="ltr" className="site-header-inner mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#top" onClick={closeMenu} data-testid="link-logo" className="focus-ring flex items-center"><img src="/bianco-logo-transparent.png" alt="Bianco بيانكو" data-testid="img-logo-header" className="site-header-logo h-8 w-[112px] object-contain object-left" /></a>
          <div dir="ltr" className="ml-auto flex items-center gap-3 md:gap-6">
            <button type="button" onClick={() => setLocale(isArabic ? 'en' : 'ar')} data-testid="button-language" aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'} className="site-header-language focus-ring min-w-10 border px-2.5 py-2.5 text-center text-[.7rem] font-semibold transition">{isArabic ? 'EN' : 'عر'}</button>
            <nav dir="ltr" className={`${menuOpen ? 'site-header-mobile-open absolute left-0 right-0 top-[74px] flex flex-col border-b px-6 pb-7 pt-6 shadow-xl' : 'site-header-mobile-closed hidden'} site-header-nav gap-6 text-[11px] uppercase tracking-[.2em] ${isArabic ? 'text-right' : 'text-left'} md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`} aria-label={t('menu')}>
              <a href={menuPath} onClick={closeMenu} data-testid="link-nav-order" className="line-link site-header-link transition">{t('menu')}</a>
              <a href="#story" onClick={closeMenu} data-testid="link-nav-story" className="line-link site-header-link transition">{t('energy')}</a>
              <a href={listingUrl} target="_blank" rel="noreferrer" data-testid="link-nav-maps" className="line-link site-header-link transition">{t('maps')} <ArrowUpRight className="ms-1 inline" size={12} /></a>
              <button type="button" onClick={() => { closeMenu(); openReservation('nav_mobile'); }} data-testid="button-nav-reserve-mobile" className="site-header-reserve mt-2 flex items-center justify-between border px-5 py-3.5 text-[.68rem] uppercase tracking-[.26em] md:hidden"><span>{t('callForTable')}</span><Phone size={13} strokeWidth={1.6} /></button>
            </nav>
            <button type="button" onClick={() => openReservation('nav')} data-testid="button-nav-reserve" className="site-header-reserve focus-ring hidden border px-4 py-2.5 text-[.64rem] uppercase tracking-[.24em] md:inline-flex">{t('reserve')}</button>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t('closeMenu') : t('openMenu')} aria-expanded={menuOpen} data-testid="button-mobile-menu" className="site-header-toggle focus-ring border p-2 md:hidden">{menuOpen ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}</button>
          </div>
        </div>
      </header>

      <section id="top" className="quiet-hero relative isolate overflow-hidden border-b border-white/10">
        <img
          src={heroImage}
          alt={t('heroAlt')}
          data-testid="img-hero"
          fetchPriority="high"
          className="quiet-hero-photo absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="hero-photo-veil absolute inset-0" />
        <div aria-hidden="true" className="quiet-hero-shade absolute inset-0" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-4 pt-[74px] sm:px-6 md:px-10">
          <div className="quiet-hero-frame relative my-4 flex flex-1 flex-col md:my-7">
            <span aria-hidden="true" className="quiet-hero-corner -left-[5px] -top-[5px]" />
            <span aria-hidden="true" className="quiet-hero-corner -right-[5px] -top-[5px]" />
            <span aria-hidden="true" className="quiet-hero-corner -bottom-[5px] -left-[5px]" />
            <span aria-hidden="true" className="quiet-hero-corner -bottom-[5px] -right-[5px]" />

            <div className="quiet-hero-content relative flex flex-1 flex-col justify-end px-6 pb-14 pt-24 text-start sm:px-10 md:max-w-[760px] md:px-16 md:pb-20">
              <p data-testid="text-hero-eyebrow" className="quiet-hero-serif text-[.7rem] uppercase tracking-[.44em] text-white/85 md:text-[.78rem]">{t('cuisine')}</p>
              <h1 data-testid="text-hero-heading" className="quiet-hero-serif quiet-hero-headline mt-5 text-[clamp(3.7rem,10vw,8.8rem)] font-normal leading-[.84] tracking-[-.045em] text-white md:mt-7">
                {t('heroHello')}<br /><em className="font-normal italic text-[#FBF3E8]">{t('heroCity')}</em>
              </h1>
              <div aria-hidden="true" className="quiet-hero-diamonds mt-7 flex items-center justify-start gap-4 md:mt-9">
                <span className="quiet-hero-rule" /><span className="quiet-hero-diamond" /><span className="quiet-hero-diamond" /><span className="quiet-hero-diamond" />
              </div>
              <p data-testid="text-hero-description" className="quiet-hero-serif mt-6 max-w-[30rem] text-[1.05rem] leading-[1.55] text-white/85 md:mt-7 md:text-[1.22rem]">{t('heroDescription')}</p>
              <div className="mt-8 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-7 md:mt-10">
                <button type="button" onClick={() => openReservation('hero')} data-testid="button-hero-reserve" className="quiet-hero-cta focus-ring inline-flex w-full items-center justify-center gap-3 border border-white bg-black/20 px-10 py-4 text-[.7rem] uppercase tracking-[.28em] text-white backdrop-blur-[2px] sm:w-auto">{t('callForTable')}</button>
                <a href={menuPath} onClick={() => trackEvent('order_started', { location: 'hero' })} data-testid="link-hero-order" className="quiet-hero-link focus-ring inline-flex items-center gap-2 py-2 text-[.7rem] uppercase tracking-[.28em] text-white/90">{t('viewMenu')} <ChevronRight size={13} strokeWidth={1.5} className="translate-y-px rotate-90" /></a>
              </div>
            </div>

            <div className="quiet-hero-serif flex items-center justify-between gap-3 border-t border-white/[.18] px-5 py-4 text-[.62rem] uppercase tracking-[.3em] text-white/70 md:px-8 md:text-[.68rem]">
              <span className="whitespace-nowrap">{t('heroFooterLeft')}</span>
              <span className="hidden whitespace-nowrap text-white/55 md:block">{t('heroFooterCenter')}</span>
              <span className="whitespace-nowrap">{t('heroFooterRight')}</span>
            </div>
          </div>
        </div>
      </section>

      <ApiMenuHighlights categories={menuCategories} locale={locale} t={t} onSelect={setSelectedProduct} />

      <section id="order" className="menu-section relative overflow-clip bg-[#f1e5d2] px-5 py-16 text-[#2b1d19] md:px-10 md:py-24">
        <div aria-hidden="true" className="menu-section-stamp absolute end-[-2.5rem] top-10 hidden h-32 w-32 items-center justify-center rounded-full border border-[#8d4a32]/25 font-mono-ui text-[8px] uppercase tracking-[.2em] text-[#8d4a32] md:flex">Bianco<br />{t('madinah')}<br />{t('everyDay')}</div>
        <div className="mx-auto max-w-[1440px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="grid gap-9 border-b border-[#63372b]/20 pb-8 md:grid-cols-[1.15fr_.85fr] md:items-end">
            <motion.div variants={reveal}>
              <div className="flex items-center gap-3 font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#9b4f2b]"><span className="h-px w-8 bg-[#9b4f2b]/60" />{t('shopMenu')}</div>
              <h2 data-testid="text-menu-heading" className="mt-5 max-w-[680px] font-display text-[4.3rem] leading-[.78] tracking-[-.065em] text-[#351e19] sm:text-7xl md:text-8xl">{t('chooseYour')}<br /><em className="text-[#a64d2d]">{t('damage')}</em></h2>
            </motion.div>
            <motion.div variants={reveal} className="md:pb-1">
              <p className="max-w-[350px] text-[15px] leading-[1.55] text-[#67473c]">{t('menuIntro')}</p>
              <p className="mt-4 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#9b7869]">{t('prices')}</p>
            </motion.div>
          </motion.div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <nav className="menu-category-scroll flex gap-2 overflow-x-auto pb-2 lg:block lg:overflow-visible" role="tablist" aria-label={t('menu')}>
                <button type="button" role="tab" onClick={() => { trackEvent('menu_category_selected', { category: 'all' }); setSelectedCategory('all'); setAllMenuExpanded(false); }} aria-selected={isAllMenu} data-testid="button-category-all" className={`focus-ring flex shrink-0 items-center gap-3 border px-4 py-3 text-start font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] transition lg:mb-2 lg:w-full ${isAllMenu ? 'border-[#612c21] bg-[#612c21] text-[#f8ead6]' : 'border-[#754333]/20 text-[#754333] hover:border-[#9b4f2b] hover:text-[#9b4f2b]'}`}><span className="opacity-50">00</span>{t('allCategories')}</button>
                {menuCategories.map((category, index) => {
                  const isActive = selectedCategory === category.id;
                  return (
                    <button type="button" role="tab" key={category.id} onClick={() => { trackEvent('menu_category_selected', { category: category.id }); setSelectedCategory(category.id); setAllMenuExpanded(false); }} aria-selected={isActive} data-testid={`button-category-${category.id}`} className={`focus-ring flex shrink-0 items-center gap-3 border px-4 py-3 text-start font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] transition lg:mb-2 lg:w-full ${isActive ? 'border-[#612c21] bg-[#612c21] text-[#f8ead6]' : 'border-[#754333]/20 text-[#754333] hover:border-[#9b4f2b] hover:text-[#9b4f2b]'}`}><span className="opacity-50">{String(index + 1).padStart(2, '0')}</span>{locale === 'ar' ? category.titleAr : category.titleEn}</button>
                  );
                })}
              </nav>
              {menuEntered && !trayOpen && (
                <button
                  type="button"
                  onClick={() => { trackEvent('bag_opened', { item_count: cartCount }); setTrayOpen(true); }}
                  aria-label={t('openCart').replace('{count}', String(cartCount))}
                  data-testid="button-menu-your-cart"
                  className="focus-ring fixed inset-x-5 bottom-5 z-30 mx-auto flex w-auto max-w-[420px] items-center justify-between gap-4 rounded-full border border-[#7a4a39]/35 bg-[#612c21] px-4 py-2.5 text-start text-[#f8ead6] shadow-lg transition hover:bg-[#74372a] lg:static lg:mt-4 lg:w-full lg:max-w-none"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4e7d4] text-[#612c21]">
                      <ShoppingBag size={16} strokeWidth={1.7} />
                      <span className="absolute -end-1 -top-1 min-w-4 rounded-full bg-[#f2b46d] px-1 text-center font-mono-ui text-[8px] font-bold text-[#351e19]">{cartCount}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono-ui text-[9px] font-bold uppercase tracking-[.15em]">{t('yourCart')}</span>
                      <span className="mt-1 block truncate text-[10px] text-[#f8ead6]/70">{cartCount ? formatPrice(subtotal, locale) : t('emptyNow')}</span>
                    </span>
                  </span>
                  <ChevronRight size={15} className="shrink-0" />
                </button>
              )}
            </div>
            <div className="min-w-0">
              {menuQuery.isLoading ? <MenuNotice kind="loading" t={t} /> : menuQuery.isError ? <MenuNotice kind="error" t={t} onRetry={() => menuQuery.refetch()} /> : !menuCategories.length ? <MenuNotice kind="empty" t={t} /> : isAllMenu ? (
                <div>
                  {menuCategories.map((category) => {
                    const categoryItems = orderedItems(category);
                    const shownItems = allMenuExpanded ? categoryItems : categoryItems.slice(0, 1);
                    return (
                      <section key={category.id} className="mb-8 last:mb-0">
                        <div className="flex items-end justify-between border-b border-[#63372b]/20 pb-3">
                          <h3 className="font-display text-3xl leading-none tracking-[-.04em] text-[#351e19]">{locale === 'ar' ? category.titleAr : category.titleEn}</h3>
                          <span className="font-mono-ui text-[9px] text-[#9b4f2b]">{String(categoryItems.length).padStart(2, '0')}</span>
                        </div>
                        <motion.div layout className="border-t border-[#63372b]/20">
                          {shownItems.map((item) => <ApiMenuItem key={item.id} item={item} category={category} locale={locale} t={t} onAdd={addToCart} onDetails={setSelectedProduct} />)}
                        </motion.div>
                      </section>
                    );
                  })}
                  {hiddenAllMenuItems > 0 && (
                    <div className="flex justify-center border-t border-[#63372b]/20 py-6">
                      <button type="button" onClick={() => setAllMenuExpanded((expanded) => !expanded)} data-testid="button-menu-show-more" aria-expanded={allMenuExpanded} className="focus-ring inline-flex items-center gap-3 rounded-full border border-[#8d4027]/50 px-6 py-3 font-mono-ui text-[9px] font-bold uppercase tracking-[.15em] text-[#612c21] transition hover:bg-[#612c21] hover:text-[#f8ead6]">
                        {allMenuExpanded ? t('showLess') : t('showMore')}
                        <ChevronDown size={14} className={`transition-transform ${allMenuExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              ) : activeCategory && visibleItems.length ? <motion.div layout className="border-t border-[#63372b]/20">{visibleItems.map((item) => <ApiMenuItem key={item.id} item={item} category={activeCategory} locale={locale} t={t} onAdd={addToCart} onDetails={setSelectedProduct} />)}</motion.div> : <MenuNotice kind="empty" t={t} />}
            </div>
          </div>
          <div className="mt-9 flex flex-col gap-3 border-t border-[#63372b]/20 pt-5 text-[10px] uppercase tracking-[.14em] text-[#875546] sm:flex-row sm:items-center sm:justify-between">
            <span>{t('prices')}</span>
            <button type="button" onClick={() => setTrayOpen(true)} data-testid="button-review-order" className="flex items-center gap-2 text-[#8d4027] transition hover:text-[#b15832]">{t('fullBag')} <ChevronRight size={14} /></button>
          </div>
        </div>
      </section>

      <section id="story" className="border-y border-[#f5eee2]/10 bg-[#1a1210] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[.8fr_1.2fr] md:items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}><motion.p variants={reveal} className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">{t('energyLabel')}</motion.p><motion.h2 variants={reveal} className="mt-5 max-w-[450px] font-display text-6xl leading-[.78] tracking-[-.06em] md:text-8xl">{t('storyHeadingA')}<br /><em className="text-[#e85d43]">{t('storyHeadingB')}</em> {t('storyHeadingC')}</motion.h2></motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-[620px] md:pt-16"><motion.p variants={reveal} className="text-2xl leading-[1.1] text-[#f5eee2] md:text-4xl">{t('storyLead')}</motion.p><motion.p variants={reveal} className="mt-8 max-w-[500px] text-base leading-relaxed text-[#9c8f84]">{t('storyBody')}</motion.p><motion.div variants={reveal} className="mt-12 grid grid-cols-2 gap-6 border-t border-[#f5eee2]/12 pt-5 sm:grid-cols-3"><div><p data-testid="text-rating" className="font-display text-4xl text-[#f2b46d]">4.4</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#716760]">{t('googleRating')}</p></div><div><p data-testid="text-hours" className="font-display text-4xl text-[#f2b46d]">02:00</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#716760]">{t('lastOrder')}</p></div><div><p data-testid="text-location" className="font-display text-4xl text-[#f2b46d]">{t('countryShort')}</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#716760]">{t('madinah')}</p></div></motion.div></motion.div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="mb-10 flex items-end justify-between gap-5"><div><p className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#f2b46d]">{t('galleryLabel')}</p><h2 className="mt-4 font-display text-6xl leading-[.78] tracking-[-.06em] md:text-8xl">{t('roomA')}<br /><em className="text-[#e85d43]">{t('roomB')}</em></h2></div><p className="hidden max-w-[220px] text-end text-sm leading-relaxed text-[#716760] md:block">{t('galleryCaption')}</p></div>
        <div className="grid auto-rows-[220px] gap-3 md:grid-cols-4 md:auto-rows-[190px]">{gallery.map((image, i) => <motion.figure key={`${image.src}-${i}`} initial={{ opacity: 0, scale: .97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .08, duration: .7 }} data-testid={`figure-gallery-${i}`} className={`group relative overflow-hidden border border-[#f5eee2]/10 ${image.className}`}><img src={image.src} alt={t(image.altKey)} data-testid={`img-gallery-${i}`} loading="lazy" className="h-full w-full object-cover opacity-70 grayscale-[.15] transition duration-700 group-hover:scale-105 group-hover:opacity-95 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#110d0c]/80 to-transparent" /><figcaption className="absolute bottom-4 start-4 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#f5eee2]/80">{t(image.altKey)}</figcaption></motion.figure>)}</div>
      </section>

      <section id="visit" className="border-t border-[#f5eee2]/10 bg-[#8d2d23] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}><motion.p variants={reveal} className="font-mono-ui text-[9px] uppercase tracking-[.25em] text-[#ffd097]">{t('visitLabel')}</motion.p><motion.h2 variants={reveal} className="mt-5 font-display text-6xl leading-[.78] tracking-[-.06em] text-[#fff2df] md:text-8xl">{t('doorA')}<br /><em>{t('doorB')}</em></motion.h2><motion.div variants={reveal} className="mt-10 space-y-5 text-sm leading-relaxed text-[#f4c6ae]"><p className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#ffd097]" size={17} /><span className="whitespace-pre-line">{t('address')}</span></p><p className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-[#ffd097]" size={17} /><span>{t('everyDay')}<br />{t('dailyHours').replace(/^Daily |^يومياً /, '')}</span></p><a href={`tel:${phoneNumber.replace(/\s/g, '')}`} data-testid="link-phone" className="flex gap-3 transition hover:text-[#fff2df]"><Phone className="mt-0.5 shrink-0 text-[#ffd097]" size={17} /><span dir="ltr">{phoneNumber}</span></a></motion.div><motion.a variants={reveal} href={listingUrl} target="_blank" rel="noreferrer" data-testid="link-google-maps" className="mt-10 inline-flex items-center gap-3 border border-[#ffd097]/60 px-5 py-3.5 text-[10px] uppercase tracking-[.15em] text-[#fff2df] transition hover:bg-[#ffd097] hover:text-[#8d2d23]">{t('googleMaps')} <ArrowUpRight size={15} /></motion.a></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8 }} className="relative min-h-[380px] overflow-hidden border border-[#ffd097]/35 bg-[#6b231c] shadow-2xl md:min-h-[500px]"><iframe title={t('findUs')} data-testid="embed-google-map" src={mapsEmbed} loading="lazy" className="absolute inset-0 h-full w-full border-0 grayscale-[.3] contrast-110" /><div className="pointer-events-none absolute start-5 top-5 bg-[#110d0c] px-4 py-3 text-[#f5eee2] shadow-lg"><p className="font-display text-2xl">Bianco</p><p className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f2b46d]">{t('mapArea')}</p></div></motion.div>
        </div>
      </section>

      <footer className="bg-[#110d0c] px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-12 border-b border-[#f5eee2]/12 pb-12 md:flex-row md:items-end"><div><img src="/bianco-logo-transparent.png" alt="Bianco بيانكو" data-testid="img-logo-footer" className="h-12 w-[142px] object-contain object-start" /><p className="mt-6 max-w-[320px] font-display text-3xl leading-[.95] text-[#f2b46d]">{t('orderLoud')}<br />{t('eatWell')}</p></div><div className="flex flex-col items-start gap-4 text-[10px] uppercase tracking-[.15em] text-[#9c8f84] md:items-end"><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp" className="transition hover:text-[#f2b46d]">{t('whatsappKitchen')} <ArrowUpRight className="ms-1 inline" size={13} /></a><a href={`tel:${phoneNumber.replace(/\s/g, '')}`} data-testid="link-footer-phone" className="transition hover:text-[#f2b46d]">{t('call')} <span dir="ltr">{phoneNumber}</span></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" data-testid="link-instagram" className="flex items-center gap-2 transition hover:text-[#f2b46d]"><Instagram size={14} /> {t('followRoom')}</a></div></div><div className="flex flex-col justify-between gap-3 pt-6 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#716760] md:flex-row"><span>بيانكو · Bianco · {t('madinah')}</span><span data-testid="text-footer-hours">{t('footerHours')}</span><span>© {new Date().getFullYear()} Bianco</span></div></div>
      </footer>

       {menuEntered && <ApiBasketTray cart={cart} cartError={cartQuery.isError} locale={locale} t={t} trayOpen={trayOpen} onToggle={() => setTrayOpen((open) => !open)} onUpdate={updateQuantity} mutationError={cartMutationError || Boolean(putCart.error)} whatsappUrl={whatsappUrl} />}
      <ReservationDialog open={reservationOpen} onOpenChange={setReservationOpen} t={t} />
        <AnimatePresence>{selectedProduct && <ApiMenuDetailModal item={selectedProduct} category={menuCategories.find((category) => category.items.some((item) => item.id === selectedProduct.id))} onClose={() => setSelectedProduct(null)} onAdd={addToCart} locale={locale} t={t} />}</AnimatePresence>
     </main>
    </>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
       <Toaster />
       </TooltipProvider>
       </QueryClientProvider>
  );
}

export default App;