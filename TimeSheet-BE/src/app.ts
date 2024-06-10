import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import GlobalErrorHandler from "./middlewares/GlobalErrorHandler";
import CustomError from "./utils/CustomError";
import routerFreelancers from "./routes/v1/freelancers.routers";
import routerProyeks from "./routes/v1/proyeks.routers";
import routerFreelancersActivities from "./routes/v1/freelancers_activities.routers";

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3005;
const BASE_URL = process.env.BASE_URL || "/api/v1";

// ROUTES
app.use(BASE_URL, routerFreelancers);
app.use(BASE_URL, routerFreelancersActivities);
app.use(BASE_URL, routerProyeks);
app.get("*", (req, res, next) => {
  const err = new CustomError(`Can't Find ${req.originalUrl} path on server`, 404);
  next(err);
});
app.use(GlobalErrorHandler);

app.listen(PORT, () => {
  console.log(`app listening on PORT ${PORT}`);
});
