import {
  boolean,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const menuCategoriesTable = pgTable("menu_categories", {
  id: text("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  sortOrder: integer("sort_order").notNull(),
  active: boolean("active").notNull().default(true),
});

export const menuItemsTable = pgTable("menu_items", {
  id: text("id").primaryKey(),
  categoryId: text("category_id")
    .notNull()
    .references(() => menuCategoriesTable.id, { onDelete: "restrict" }),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  price: integer("price_sar").notNull(),
  calories: integer("calories"),
  imagePath: text("image_path"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull(),
  available: boolean("available").notNull().default(true),
});