import express from "express";
import { addFreelancers } from "../../controllers/freelancers.controllers";

const router = express.Router();

router.post("/freelancers", addFreelancers);

const routerFreelancers = router;
export default routerFreelancers;
