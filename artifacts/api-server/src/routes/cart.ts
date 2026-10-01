import { and, asc, eq, inArray } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  GetCartParams,
  GetCartResponse,
  PutCartBody,
  PutCartParams,
  PutCartResponse,
} from "@workspace/api-zod";
import {
  db,
  menuCartItemsTable,
  menuCartsTable,
  menuItemsTable,
} from "@workspace/db";

async function readCart(cartId: string) {
  const [cart] = await db
    .select({ updatedAt: menuCartsTable.updatedAt })
    .from(menuCartsTable)
    .where(eq(menuCartsTable.id, cartId))
    .limit(1);

  const rows = await db
    .select({
      quantity: menuCartItemsTable.quantity,
      item: {
        id: menuItemsTable.id,
        categoryId: menuItemsTable.categoryId,
        nameEn: menuItemsTable.nameEn,
        nameAr: menuItemsTable.nameAr,
        descriptionEn: menuItemsTable.descriptionEn,
        descriptionAr: menuItemsTable.descriptionAr,
        price: menuItemsTable.price,
        calories: menuItemsTable.calories,
        imagePath: menuItemsTable.imagePath,
        featured: menuItemsTable.featured,
        sortOrder: menuItemsTable.sortOrder,
        available: menuItemsTable.available,
      },
    })
    .from(menuCartItemsTable)
    .innerJoin(
      menuItemsTable,
      eq(menuCartItemsTable.menuItemId, menuItemsTable.id),
    )
    .where(
      and(
        eq(menuCartItemsTable.cartId, cartId),
        eq(menuItemsTable.available, true),
      ),
    )
    .orderBy(asc(menuItemsTable.sortOrder));

  const items = rows.map(({ item, quantity }) => ({ item, quantity }));
  const subtotal = items.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0,
  );

  return GetCartResponse.parse({
    cartId,
    items,
    subtotal,
    updatedAt: cart?.updatedAt.toISOString() ?? null,
  });
}

const router: IRouter = Router();

router.get("/carts/:cartId", async (req, res) => {
  const parsed = GetCartParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid cart ID." });
  }

  return res.json(await readCart(parsed.data.cartId));
});

router.put("/carts/:cartId", async (req, res) => {
  const parsedParams = PutCartParams.safeParse(req.params);
  const parsedBody = PutCartBody.safeParse(req.body);

  if (!parsedParams.success || !parsedBody.success) {
    return res.status(400).json({ message: "Invalid cart update." });
  }

  const { cartId } = parsedParams.data;
  const { items } = parsedBody.data;
  const itemIds = items.map((item) => item.itemId);

  if (new Set(itemIds).size !== itemIds.length) {
    return res.status(400).json({ message: "Duplicate menu items are not allowed." });
  }

  if (itemIds.length > 0) {
    const availableItems = await db
      .select({ id: menuItemsTable.id })
      .from(menuItemsTable)
      .where(
        and(
          inArray(menuItemsTable.id, itemIds),
          eq(menuItemsTable.available, true),
        ),
      );

    if (availableItems.length !== itemIds.length) {
      return res
        .status(404)
        .json({ message: "A menu item is missing or unavailable." });
    }
  }

  const updatedAt = new Date();
  await db.transaction(async (transaction) => {
    await transaction
      .insert(menuCartsTable)
      .values({ id: cartId, updatedAt })
      .onConflictDoUpdate({
        target: menuCartsTable.id,
        set: { updatedAt },
      });

    await transaction
      .delete(menuCartItemsTable)
      .where(eq(menuCartItemsTable.cartId, cartId));

    if (items.length > 0) {
      await transaction.insert(menuCartItemsTable).values(
        items.map(({ itemId, quantity }) => ({
          cartId,
          menuItemId: itemId,
          quantity,
        })),
      );
    }
  });

  return res.json(await readCart(cartId));
});

export default router;