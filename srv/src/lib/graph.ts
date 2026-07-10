import { DeveloperState } from "./state.js";
import { initTask  } from "./node.js";
import { StateGraph } from "@langchain/langgraph";

export const developerAgentGraph = new StateGraph(DeveloperState)
  .addNode("initTask ", initTask )
  .addEdge("__start__", "initTask ")
  .addEdge("initTask ", "__end__")
  .compile();
