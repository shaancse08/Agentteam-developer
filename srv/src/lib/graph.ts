import { DeveloperState } from "./state.js";
import { explore } from "./node.js";
import { StateGraph } from "@langchain/langgraph";

export const developerAgentGraph = new StateGraph(DeveloperState)
  .addNode("explore", explore)
  .addEdge("__start__", "explore")
  .addEdge("explore", "__end__")
  .compile();
