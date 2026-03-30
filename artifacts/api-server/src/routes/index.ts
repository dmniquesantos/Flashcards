import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scanCardsRouter from "./scanCards";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scanCardsRouter);

export default router;
