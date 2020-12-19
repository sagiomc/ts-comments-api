import { serve, setup } from "swagger-ui-express";
import { Router } from "express";
import swaggerConfig from "../../docs";

const swaggerRoutes = Router();

swaggerRoutes.use("/docs", serve, setup(swaggerConfig));

export { swaggerRoutes };
