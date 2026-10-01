import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { menuItemsTable } from "./menu";

export const menuCartsTable = pgTable("menu_carts", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const menuCartItemsTable = pgTable(
  "menu_cart_items",
  {
    cartId: uuid("cart_id")
      .notNull()
      .references(() => menuCartsTable.id, { onDelete: "cascade" }),
    menuItemId: text("menu_item_id")
      .notNull()
      .references(() => menuItemsTable.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.cartId, table.menuItemId],
    }),
    quantityBounds: check(
      "menu_cart_items_quantity_bounds",
      sql`${table.quantity} between 1 and 99`,
    ),
  }),
);