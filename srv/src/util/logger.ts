import cds from "@sap/cds";
import { v4 as uuidv4 } from "uuid";

const log = cds.log("developer-agent");

export const logEvent = async (
  taskId: string,
  eventType: string,
  details: string,
) => {
  const { TaskLogs } = cds.entities("devagent");
  const sNewTaskLogId = uuidv4();

  cds.log(`Logging event for task ${taskId}: ${eventType} - ${details}`);

  await INSERT.into(TaskLogs)
    .columns("ID", "task_ID", "eventType", "detail")
    .values(sNewTaskLogId, taskId, eventType, details);
};
