import express from "express";
import {
  addFreelancersActivities,
  getAllFreelancersActivitiesByUidFreelances,
  modifyFreelancersActivities,
  removeFreelancersActivities
} from "../../controllers/freelancers_activities.controllers";

const router = express.Router();

router.get("/freelancers_activities", getAllFreelancersActivitiesByUidFreelances);
router.post("/freelancers_activities", addFreelancersActivities);
router.put("/freelancers_activities/:UID_FreelancerActivity", modifyFreelancersActivities);
router.delete("/freelancers_activities/:UID_FreelancerActivity", removeFreelancersActivities);

const routerFreelancersActivities = router;
export default routerFreelancersActivities;
