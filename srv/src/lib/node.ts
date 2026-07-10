import cds from "@sap/cds";
import { DeveloperStateType } from "./state.js";
import { v4 as uuidv4 } from "uuid";
import { logEvent } from "../util/logger.js";
import { EventType, Status } from "#cds-models/com/reusable";

export const initTask  = async (
  state: DeveloperStateType,
): Promise<Partial<DeveloperStateType>> => {
  const { Tasks } = cds.entities("devagent");
  const sNewTaskId = state.taskId;
  const sStatus = Status.in_progress;

  try {
    // Save Task ID and Project Name and Task Description and Task id to be saved to Database.
    await INSERT.into(Tasks)
      .columns("ID", "projectName", "taskDescription", "status")
      .values(sNewTaskId, state.projectName, state.taskDescription, sStatus);

    // Log all teh details of the task creation to the TaskLogs table.
    await logEvent(
      sNewTaskId,
      EventType.task_received,
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
