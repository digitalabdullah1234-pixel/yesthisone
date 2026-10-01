import { Router, type IRouter } from "express";
import cartRouter from "./cart";
import healthRouter from "./health";
import menuRouter from "./menu";

const router: IRouter = Router();

router.use(healthRouter);
router.use(menuRouter);
router.use(cartRouter);

export default router;
