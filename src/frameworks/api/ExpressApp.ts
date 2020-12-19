import { Application, default as express } from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { v1Router } from "./routes/v1";

export type AppConfig = {
  port: number;
  mode: string;
};

export class ExpressApp {

  private eApp: Application;
  private config: AppConfig;

  public constructor(config: AppConfig) {
    this.eApp = express();
    this.config = config;
  }

  public start(): Application {
    if (!this.eApp) {
      this.eApp = express();
    }

    this.configApp();

    this.eApp.listen(this.config.port, () => {
      console.log(`App listening on port: ${this.config.port} in ${this.config.mode} mode.`);
    });

    return this.eApp;
  }

  private configApp(): void {
    const eApp = this.eApp;
    eApp.use(bodyParser.json());
    eApp.use(bodyParser.urlencoded({ extended: true }));
    eApp.use(cors());
    eApp.use(compression());
    eApp.use(morgan("combined"));
    eApp.use(helmet());
    eApp.use(v1Router);
  }
}
