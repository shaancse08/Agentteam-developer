import cds from "@sap/cds";
import { DeveloperStateType } from "./state.js";
import { v4 as uuidv4 } from "uuid";
import { logEvent } from "../util/logger.js";

export const explore = async (
  state: DeveloperStateType,
): Promise<Partial<DeveloperStateType>> => {
  const { Tasks } = cds.entities("devagent");
  const sNewTaskId = uuidv4();
  const sStatus = "in_progress";

  try {
    // Save Task ID and Project Name and Task Description and Task id to be saved to Database.
    await INSERT.into(Tasks)
      .columns("ID", "projectName", "taskDescription", "status")
      .values(sNewTaskId, state.projectName, state.taskDescription, sStatus);

    // Log all teh details of the task creation to the TaskLogs table.
    await logEvent(
      sNewTaskId,
      `Task Created`,
      `Task created with description: ${state.taskDescription}`,
    );
  } catch (error: Error | any) {
    return {
      errorContext: `Error inserting task into database: ${error.message}`,
    };
  }

  return {
    taskId: sNewTaskId,
    taskStatus: sStatus,
  };
};
