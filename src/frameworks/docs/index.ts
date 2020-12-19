import { apiRoot } from "../../config";
import components from "./schemas/components";
import paths from "./paths";
import schemas from "./schemas";

export default {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Comment API",
    description: "A minimal and easy to follow example of what you need to create a CRUD style API in NodeJs using TypeScript"
  },
  servers: [
    {
      url: "https:" + apiRoot,
      description: "Https protocol"
    },
    {
      url: "http:" + apiRoot,
      description: "Http protocol"
    }
  ],
  tags: [{
    name: "Comments",
    description: "API for comments in blog or wiki system"
  }],
  paths,
  schemas,
  components
};
