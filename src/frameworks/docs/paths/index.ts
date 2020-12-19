import { commentIdPath, commentPath } from "./commentPath";

export default {
  "/comment": commentPath,
  "/comment/{id}": commentIdPath
};
