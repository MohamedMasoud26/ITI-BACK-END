import morgan from "morgan";
import connectDB from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import collectionRouter from "./modules/collection/collection.router.js";
import projectRouter from "./modules/projects/projects.router.js";
import recentRouter from "./modules/recent/recent.router.js";
import partnerRouter from "./modules/partner/partner.router.js";
import userRouter from "./modules/user/user.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
  app.use(morgan("dev"));
  app.use(express.json({}));
  app.use("/uploads", express.static("uploads"));
  app.use(`/auth`, authRouter);
  app.use(`/user`, userRouter);
  app.use(`/collection`, collectionRouter);
  app.use(`/project`, projectRouter);
  app.use(`/recent`, recentRouter);
  app.use(`/partner`, partnerRouter);

  app.all("*", (req, res, next) => {
    res.status(500).send("In-valid Routing Plz check url  or  method");
  });
  app.use(globalErrorHandling);

  connectDB();
};

export default initApp;
