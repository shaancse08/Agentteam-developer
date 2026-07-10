import { Annotation } from "@langchain/langgraph";

export const DeveloperState = Annotation.Root({
  // Input parameters for the developer service
  taskDescription: Annotation<string>(),
  taskStatus: Annotation<"received" | "in_progress" | "completed" | "failed">(),
  projectName: Annotation<string>(), // input, set at invocation like taskId/taskDescription

  // Populate by the developer Agent
  taskId: Annotation<string>(), // unique identifier for the task, e.g. a UUID


  pastTaskSummaries:
    Annotation<
      { taskDescription: string; explanation: string; filePath: string }[]
    >(), // populated by a new node before `select`, used as context in `select`/`generate`

  // Populated by `explore`
  fileList: Annotation<string[]>({
    reducer: (prev, next) => [...(prev || []), ...(next || [])], // accumulate file paths across multiple explore calls
    default: () => [], // starts as an empty array
  }), // every file path found under TARGET_REPO_PATH

  // Populated by `select`
  selectedFiles: Annotation<string[]>(), // subset of fileList the LLM decided is relevant

  // Populated by `generate`
  proposedChanges: Annotation<{ filePath: string; newContent: string }[]>(),

  // Populated by `verify`
  verifyPassed: Annotation<boolean | null>({
    reducer: (prev, next) => next, // always overwrite with the latest result
    default: () => null, // starts as null, becomes true/false after verify
  }),
  verifyOutput: Annotation<string>(), // raw stdout/stderr from tsc/test run

  // Retry control
  retryCount: Annotation<number>({
    reducer: (prev, next) => next, // always increment on retry, never decrement
    default: () => 0,
  }), // starts at 0, incremented on verify failure
  maxRetries: Annotation<number>({
    reducer: (prev, next) => next, // always increment on retry, never decrement
    default: () => 3,
  }), // e.g. 3, could be a constant instead of state

  // Fed back into `generate` on retry
  errorContext: Annotation<string | null>(), // = verifyOutput from the failed attempt, so generate knows why it failed

  // Optional but useful
  finalExplanation: Annotation<string>(), // human-readable summary of what was done, set at the end
});

export type DeveloperStateType = typeof DeveloperState.State;
