import {
  db,
  menuCategoriesTable,
  menuItemsTable,
} from "@workspace/db";

type MenuSeedItem = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  calories: number | null;
  imagePath: string | null;
  featured?: boolean;
};

type MenuSeedCategory = {
  id: string;
  titleEn: string;
  titleAr: string;
  items: MenuSeedItem[];
};

const catalog: MenuSeedCategory[] = [
  {
    id: "appetizers",
    titleEn: "Appetizers",
    titleAr: "المقبلات",
    items: [
      {
        id: "arancini",
        nameEn: "Arancini",
        nameAr: "أرانشيني",
        descriptionEn:
          "Crispy risotto balls stuffed with mozzarella and Italian herbs, served with Parmesan cream.",
        descriptionAr:
          "كرات الريزوتو محشية بالموزاريلا والأعشاب الإيطالية مع صوص كريمة البارميزان.",
        price: 49,
        calories: 590,
        imagePath: "menu-dishes/arancini.png",
        featured: true,
      },
      {
        id: "chili-shrimp",
        nameEn: "Chili Shrimp",
        nameAr: "تشيلي شرمب",
        descriptionEn:
          "Grilled shrimp smothered in spicy chili sauce infused with fresh basil.",
        descriptionAr:
          "روبيان مشوي بصوص الفلفل الحار ومعطر بالريحان الطازج.",
        price: 36,
        calories: 265,
        imagePath: "menu-dishes/chili-shrimp.png",
      },
      {
        id: "french-fries",
        nameEn: "French Fries",
        nameAr: "بطاطس مقلية",
        descriptionEn:
          "French fries seasoned with a blend of Italian herbs and spices.",
        descriptionAr:
          "أصابع البطاطس المقلية متبلة بمزيج من البهارات الإيطالية.",
        price: 15,
        calories: 265,
        imagePath: "menu-dishes/french-fries.png",
      },
    ],
  },
  {
    id: "soups",
    titleEn: "Soups",
    titleAr: "الشوربات",
    items: [
      {
        id: "mushroom-soup",
        nameEn: "Mushroom Soup",
        nameAr: "شوربة الفطر",
        descriptionEn:
          "A harmonious blend of assorted mushrooms with rich Italian cream.",
        descriptionAr:
          "مزيج متناغم من أنواع الفطر مع الكريمة الإيطالية.",
        price: 35,
        calories: 381,
        imagePath: "menu-dishes/mushroom-soup.png",
      },
      {
        id: "pumpkin-soup",
        nameEn: "Pumpkin Soup",
        nameAr: "شوربة قرع العسل",
        descriptionEn: "Pumpkin and carrot soup with rich cream.",
        descriptionAr: "شوربة قرع العسل مع الجزر والكريمة الغنية.",
        price: 29,
        calories: 266,
        imagePath: "menu-dishes/pumpkin-soup.webp",
      },
    ],
  },
  {
    id: "salads",
    titleEn: "Salads",
    titleAr: "السلطات",
    items: [
      {
        id: "burrata-salad",
        nameEn: "Burrata Salad",
        nameAr: "سلطة بوراتا",
        descriptionEn:
          "Fresh mixed greens with sliced bresaola and burrata cheese.",
        descriptionAr:
          "ورقيات طازجة مع شرائح البريزاولا وجبن البوراتا.",
        price: 59,
        calories: 372,
        imagePath: "menu-dishes/burrata-salad.png",
      },
      {
        id: "bianco-salad",
        nameEn: "Bianco Salad",
        nameAr: "سلطة بيانكو",
        descriptionEn:
          "Grilled chicken with fresh mixed greens, orange segments, and our signature Bianco dressing.",
        descriptionAr:
          "دجاج مشوي مع الورقيات الطازجة وشرائح البرتقال وصوص بيانكو الخاص.",
        price: 42,
        calories: 410,
        imagePath: "menu-dishes/bianco-salad.png",
      },
      {
        id: "portobello-shrimp-salad",
        nameEn: "Portobello Shrimp Salad",
        nameAr: "سلطة البورتوبلو شرمب",
        descriptionEn:
          "Portobello mushrooms with fresh mixed greens, avocado, and shrimp, tossed in our signature seasoning.",
        descriptionAr:
          "فطر البورتوبلو مع الورقيات الطازجة والأفوكادو والروبيان بتتبيلة مميزة.",
        price: 52,
        calories: 489,
        imagePath: "menu-dishes/portobello-shrimp-salad.png",
      },
      {
        id: "quinoa-salad",
        nameEn: "Quinoa Salad",
        nameAr: "سلطة الكينوا",
        descriptionEn:
          "Red quinoa with pumpkin, beetroot, avocado, and pomegranate.",
        descriptionAr:
          "حبوب الكينوا الحمراء مع القرع والبنجر والأفوكادو والرمان.",
        price: 45,
        calories: 388,
        imagePath: "menu-dishes/quinoa-salad.webp",
      },
    ],
  },
  {
    id: "pizza",
    titleEn: "Pizza",
    titleAr: "البيتزا",
    items: [
      {
        id: "margherita-pizza",
        nameEn: "Margherita Pizza",
        nameAr: "بيتزا مارجريتا",
        descriptionEn:
          "San Marzano tomatoes, mozzarella, Parmesan cheese, and fresh basil.",
        descriptionAr:
          "طماطم سان مارزانو مع الموزاريلا والبارميزان والريحان الطازج.",
        price: 50,
        calories: 944,
        imagePath: "menu-dishes/margherita-pizza.png",
        featured: true,
      },
      {
        id: "diavola-pizza",
        nameEn: "Diavola Pizza",
        nameAr: "بيتزا ديافولا",
        descriptionEn:
          "San Marzano tomatoes, Italian pepperoni, Italian rucola, mozzarella, and Parmesan.",
        descriptionAr:
          "طماطم سان مارزانو والببروني الإيطالي والجرجير مع الموزاريلا والبارميزان.",
        price: 62,
        calories: 980,
        imagePath: "menu-dishes/diavola-pizza.png",
      },
      {
        id: "beef-bianco-pizza",
        nameEn: "Beef Bianco Pizza",
        nameAr: "بيتزا بيف بيانكو",
        descriptionEn:
          "Creamy sauce and beef topped with mozzarella, Italian rucola, pine nuts, and Ajwa dates.",
        descriptionAr:
          "صلصة كريمية ولحم مع الموزاريلا والجرجير والصنوبر وتمر العجوة.",
        price: 85,
        calories: 1387,
        imagePath: "menu-dishes/beef-bianco-pizza.png",
      },
      {
        id: "chicken-polo-pizza",
        nameEn: "Chicken Polo Pizza",
        nameAr: "بيتزا تشكن بولو",
        descriptionEn:
          "Smoked chicken pizza with creamy sauce, Portobello mushrooms, fried herbs, and fresh basil.",
        descriptionAr:
          "بيتزا الدجاج المدخن وصلصة الكريمة مع فطر البورتوبلو والأعشاب والريحان.",
        price: 67,
        calories: 966,
        imagePath: "menu-dishes/chicken-polo-pizza.png",
      },
      {
        id: "truffle-pizza",
        nameEn: "Truffle Pizza",
        nameAr: "بيتزا ترافل",
        descriptionEn:
          "Truffle cream pizza blended with mozzarella, fresh basil, and Parmesan cheese.",
        descriptionAr:
          "بيتزا كريمة الترافل مع الموزاريلا والريحان والبارميزان.",
        price: 78,
        calories: 1050,
        imagePath: "menu-dishes/truffle-pizza.png",
      },
      {
        id: "pesto-pizza",
        nameEn: "Pesto Pizza",
        nameAr: "بيتزا بيستو",
        descriptionEn:
          "Pesto pizza with burrata cheese and cherry tomatoes.",
        descriptionAr:
          "بيتزا بيستو مع جبن البوراتا والطماطم الكرزية.",
        price: 68,
        calories: 1159,
        imagePath: "menu-dishes/pesto-pizza.webp",
      },
    ],
  },
  {
    id: "pasta",
    titleEn: "Pasta",
    titleAr: "الباستا",
    items: [
      {
        id: "seafood-spaghetti",
        nameEn: "Seafood Spaghetti",
        nameAr: "اسباغيتي سي فود",
        descriptionEn:
          "Spaghetti with Italian sauce and a delicious mix of seafood.",
        descriptionAr:
          "اسباغيتي مع الصلصة الإيطالية ومزيج من المأكولات البحرية الشهية.",
        price: 63,
        calories: 530,
        imagePath: "menu-dishes/seafood-spaghetti.png",
        featured: true,
      },
      {
        id: "penne-rose",
        nameEn: "Penne Rosé",
        nameAr: "بيني روز",
        descriptionEn:
          "Penne pasta with rich cream sauce, Italian sauce, and tender chicken.",
        descriptionAr:
          "باستا البيني مع الكريمة الغنية والصلصة الإيطالية والدجاج.",
        price: 45,
        calories: 563,
        imagePath: "menu-dishes/penne-rose.png",
      },
      {
        id: "rigatoni-pesto",
        nameEn: "Rigatoni Pesto",
        nameAr: "ريجاتوني بيستو",
        descriptionEn:
          "Rigatoni pasta with signature pesto cream, broccoli florets, and tender chicken.",
        descriptionAr:
          "باستا الريجاتوني مع كريمة البيستو والبروكلي والدجاج.",
        price: 49,
        calories: 751,
        imagePath: "menu-dishes/rigatoni-pesto.png",
      },
      {
        id: "funghi-risotto",
        nameEn: "Funghi Risotto",
        nameAr: "ريزوتو فونجي",
        descriptionEn:
          "Our signature risotto prepared with a selection of fresh mushrooms.",
        descriptionAr:
          "طبق الريزوتو الشهير مع خليط من الفطر الطازج.",
        price: 59,
        calories: 519,
        imagePath: "menu-dishes/funghi-risotto.png",
      },
      {
        id: "truffle-fettuccine",
        nameEn: "Truffle Fettuccine",
        nameAr: "فيتوتشيني ترافل",
        descriptionEn: "Fettuccine pasta tossed in a rich truffle cream sauce.",
        descriptionAr: "باستا الفيتوتشيني مع كريمة الترافل.",
        price: 52,
        calories: 637,
        imagePath: "menu-dishes/truffle-fettuccine.png",
      },
    ],
  },
  {
    id: "main-courses",
    titleEn: "Main Courses",
    titleAr: "الأطباق الرئيسية",
    items: [
      {
        id: "beef-bianco",
        nameEn: "Beef Bianco",
        nameAr: "بيف بيانكو",
        descriptionEn:
          "Tenderloin beef slices served with mushroom sauce and sautéed vegetables.",
        descriptionAr:
          "شرائح لحم التندرلوين مع صوص الفطر وخضار السوتيه.",
        price: 82,
        calories: 1210,
        imagePath: "menu-dishes/beef-bianco.png",
        featured: true,
      },
      {
        id: "grilled-salmon",
        nameEn: "Grilled Salmon",
        nameAr: "جرلد سالمون",
        descriptionEn:
          "Grilled salmon served with lemon butter sauce and sautéed vegetables.",
        descriptionAr:
          "سالمون مشوي بصوص الزبدة والليمون مع خضار السوتيه.",
        price: 79,
        calories: 861,
        imagePath: "menu-dishes/grilled-salmon.png",
        featured: true,
      },
      {
        id: "chicken-pesto-roulade",
        nameEn: "Chicken Pesto Roulade",
        nameAr: "رول دجاج بالبيستو",
        descriptionEn:
          "Chicken roulade stuffed with cheese, fresh spinach, and sun-dried tomatoes, Italian style.",
        descriptionAr:
          "دجاج ملفوف محشو بالجبن والسبانخ الطازجة والطماطم المجففة على الطريقة الإيطالية.",
        price: 66,
        calories: 770,
        imagePath: "menu-dishes/chicken-pesto-roulade.webp",
      },
    ],
  },
  {
    id: "desserts",
    titleEn: "Desserts",
    titleAr: "الحلويات",
    items: [
      {
        id: "tiramisu",
        nameEn: "Tiramisu",
        nameAr: "تيراميسو",
        descriptionEn: "",
        descriptionAr: "",
        price: 45,
        calories: null,
        imagePath: null,
      },
    ],
  },
  {
    id: "drinks",
    titleEn: "Drinks",
    titleAr: "المشروبات",
    items: [
      {
        id: "bianco-paradiso",
        nameEn: "Bianco Paradiso",
        nameAr: "بيانكو براديسو",
        descriptionEn: "",
        descriptionAr: "",
        price: 21,
        calories: 433,
        imagePath: "menu-dishes/bianco-paradiso.webp",
        featured: true,
      },
      {
        id: "florenza-pomegranate",
        nameEn: "Florenza Pomegranate",
        nameAr: "فلورنزا بومجرانيت",
        descriptionEn: "",
        descriptionAr: "",
        price: 23,
        calories: 345,
        imagePath: "menu-dishes/florenza-pomegranate.webp",
      },
      {
        id: "festa-di-passione",
        nameEn: "Festa Di Passione",
        nameAr: "فيستا دي باشيوني",
        descriptionEn: "",
        descriptionAr: "",
        price: 24,
        calories: 173,
        imagePath: "menu-dishes/festa-di-passione.webp",
      },
      {
        id: "orange-juice",
        nameEn: "Orange Juice",
        nameAr: "عصير برتقال",
        descriptionEn: "",
        descriptionAr: "",
        price: 16,
        calories: 353,
        imagePath: "menu-dishes/orange-juice.webp",
      },
      {
        id: "flat-white",
        nameEn: "Flat White",
        nameAr: "فلات وايت",
        descriptionEn: "",
        descriptionAr: "",
        price: 16,
        calories: null,
        imagePath: "menu-dishes/flat-white.webp",
      },
      {
        id: "coffee-americano",
        nameEn: "Coffee Americano",
        nameAr: "قهوة أمريكانو",
        descriptionEn: "",
        descriptionAr: "",
        price: 14,
        calories: null,
        imagePath: "menu-dishes/coffee-americano.webp",
      },
      {
        id: "iced-americano",
        nameEn: "Iced Americano",
        nameAr: "أمريكانو بارد",
        descriptionEn: "",
        descriptionAr: "",
        price: 14,
        calories: null,
        imagePath: "menu-dishes/iced-americano.webp",
      },
      {
        id: "soft-drinks",
        nameEn: "Soft Drinks",
        nameAr: "مشروبات غازية",
        descriptionEn: "",
        descriptionAr: "",
        price: 6,
        calories: null,
        imagePath: null,
      },
      {
        id: "water",
        nameEn: "Water",
        nameAr: "ماء",
        descriptionEn: "",
        descriptionAr: "",
        price: 6,
        calories: null,
        imagePath: null,
      },
      {
        id: "mineral-water",
        nameEn: "Mineral Water",
        nameAr: "مياه معدنية",
        descriptionEn: "",
        descriptionAr: "",
        price: 6,
        calories: null,
        imagePath: null,
      },
      {
        id: "carbonated-water",
        nameEn: "Carbonated Water",
        nameAr: "مياه غازية",
        descriptionEn: "",
        descriptionAr: "",
        price: 8,
        calories: null,
        imagePath: null,
      },
    ],
  },
];

const categoryRows = catalog.map(
  ({ id, titleEn, titleAr }, sortOrder) => ({
    id,
    titleEn,
    titleAr,
    sortOrder,
    active: true,
  }),
);

const itemRows = catalog.flatMap(({ id: categoryId, items }) =>
  items.map((item, sortOrder) => ({
    ...item,
    categoryId,
    sortOrder,
    featured: item.featured ?? false,
    available: true,
  })),
);

export async function seedMenuCatalogIfEmpty() {
  const [existingCategories, existingItems] = await Promise.all([
    db
      .select({ id: menuCategoriesTable.id })
      .from(menuCategoriesTable)
      .limit(1),
    db.select({ id: menuItemsTable.id }).from(menuItemsTable).limit(1),
  ]);

  if (existingCategories.length > 0 && existingItems.length > 0) {
    return false;
  }

  if (existingCategories.length > 0 || existingItems.length > 0) {
    throw new Error(
      "The menu catalog is only partially seeded; refusing to overwrite it.",
    );
  }

  await db.transaction(async (transaction) => {
    await transaction.insert(menuCategoriesTable).values(categoryRows);
    await transaction.insert(menuItemsTable).values(itemRows);
  });

  return true;
}