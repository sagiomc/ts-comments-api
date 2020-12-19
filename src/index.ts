import { ExpressApp } from "./frameworks/api/ExpressApp";
import { appConfig } from "./config";

const expressApp = new ExpressApp(appConfig.express);

expressApp.start();
