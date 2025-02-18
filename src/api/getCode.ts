"use server";

import { ElementConfigs } from "@/components/elementConfigs";
import { ScenarioIds } from "@/types/scenarios";
import { ScenarioFunctions } from "./scenarioFunctions";

export async function getCode(scenarioID: ScenarioIds) {
  const js = ElementConfigs[scenarioID];
  const backend = ScenarioFunctions[scenarioID];
  return `### Stripe Elements Options ###\n${JSON.stringify(js, null, 4)}\n\n### Backend Scenario ###\n${String(
    backend
  )}`;
}
