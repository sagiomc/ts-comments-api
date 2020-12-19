import { Router } from "express";
import { apiRoot } from "../../../config";
import { commentsRoutes } from "./commentsRoutes";
import { swaggerRoutes } from "./swaggerRoutes";

const v1Router = Router();

v1Router.get("/", (req, res) => {
  return res.json({ message: "Yo! We're up!" });
});

v1Router.use(swaggerRoutes);
v1Router.use(`${apiRoot}/comment`, commentsRoutes);

export { v1Router };
