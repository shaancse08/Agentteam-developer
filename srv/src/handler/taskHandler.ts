import cds, { Request } from "@sap/cds";
import { developerAgentGraph } from "../lib/graph.js";
import { v4 as uuidv4 } from "uuid";

const log = cds.log("developer-agent");
export const submitTask = async (req: Request) => {
  const { projectName, taskDescription, filePath } = req.data;
  log.info(
    `Received submitTask request: projectName=${projectName}, taskDescription=${taskDescription}, filePath=${filePath}`,
  );

  // Validate input parameters
  if (!projectName || !taskDescription || !filePath) {
    log.error("Missing required parameters in submitTask request");
    req.reject(
      400,
      "Missing required parameters: projectName, taskDescription, filePath",
    );
    return;
  }

  const developerGraph = await developerAgentGraph.invoke({
    projectName: projectName,
    taskDescription: taskDescription,
    fileList: [filePath],
    taskId: uuidv4(), // Generate a unique task ID for this request
  });

  if (developerGraph.verifyPassed === false) {
    log.error(`Task verification failed: ${developerGraph.verifyOutput}`);
    req.reject(500, `Task verification failed: ${developerGraph.verifyOutput}`);
    return;
  }

  log.info(
    `Task submitted successfully: taskId=${developerGraph.taskId}, status=${developerGraph.taskStatus}`,
  );
  return {
    ...developerGraph,
  };
};
