import {createInterface} from "node:readline/promises";
import {Agent} from "../agent/agent.js";

export async function startCli(agent: Agent) {
    const rl = createInterface({input: process.stdin, output: process.stdout});
    while (true) {
        let prompt = await rl.question("user:");
        let events = agent.run(prompt);

        let startOutput = false;
        let startReasoning = false;
        for await (const event of events) {
            switch (event.type) {
                case "response.output_text.delta":
                    if (!startOutput){
                        startOutput = true;
                        process.stdout.write("llm:")
                    }
                    process.stdout.write(event.delta);
                    break;
                case "response.output_text.done":
                    startOutput = false;
                    process.stdout.write("\n\n");
                    break;
                case "response.reasoning_text.delta":
                    if (!startReasoning){
                        startReasoning = true;
                        process.stdout.write("reasoning:")
                    }
                    process.stdout.write(event.delta);
                    break;
                case "response.reasoning_text.done":
                    startReasoning = false;
                    process.stdout.write("\n\n");
                    break;
            }
        }
    }
}