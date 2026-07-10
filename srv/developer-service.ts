import cds from "@sap/cds";
import { submitTask } from "./src/handler/taskHandler.js";

export default class DeveloperService extends cds.ApplicationService {
  async init() {
    this.on("submitTask", submitTask);
    return super.init();
  }
}
