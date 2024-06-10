import express from "express";
import { addProyeks, getAllProyeks } from "../../controllers/proyeks.controllers";

const router = express.Router();

router.get("/proyeks", getAllProyeks);
router.post("/proyeks", addProyeks);

const routerProyeks = router;
export default routerProyeks;
