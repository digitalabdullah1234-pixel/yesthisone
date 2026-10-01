import { and, asc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { GetMenuResponse } from "@workspace/api-zod";
import { db, menuCategoriesTable, menuItemsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/menu", async (_req, res) => {
  const [categories, items] = await Promise.all([
    db
      .select({
        id: menuCategoriesTable.id,
        titleEn: menuCategoriesTable.titleEn,
        titleAr: menuCategoriesTable.titleAr,
        sortOrder: menuCategoriesTable.sortOrder,
      })
      .from(menuCategoriesTable)
      .where(eq(menuCategoriesTable.active, true))
      .orderBy(asc(menuCategoriesTable.sortOrder)),
    db
      .select({
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
      })
      .from(menuItemsTable)
      .where(eq(menuItemsTable.available, true))
      .orderBy(asc(menuItemsTable.sortOrder)),
  ]);

  const data = {
    categories: categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.categoryId === category.id),
    })),
  };

  res.json(GetMenuResponse.parse(data));
});

export default router;