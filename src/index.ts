import "reflect-metadata";
import {container, instanceCachingFactory} from "tsyringe";
import {Agent} from "./agent/agent.js"
import {LLM} from "./llm/llm.js";
import {startCli} from "./cli/app.js";
import {ToolRegister} from "./agent/tools/register.js";
import {ToolClasses} from "./agent/tools/builtin.js";

async function main() {
    const baseURL = process.env.OPENAI_BASE_URL;
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.MODEL_NAME;

    if (!baseURL || !apiKey || !model) {
        throw new Error("请配置 env");
    }

    container.register(LLM, {
        useFactory: instanceCachingFactory(
            () => new LLM(baseURL, apiKey),
        ),
    });

    container.register(Agent, {
        useFactory: (c) => new Agent(c.resolve(LLM), model, c.resolve(ToolRegister)),
    });

    registerTools();

    const agent = container.resolve(Agent);
    await startCli(agent);
}

function registerTools() {
    for (const ToolClass of ToolClasses) {
        container.registerSingleton(ToolClass);
    }

    container.register(ToolRegister, {
        useFactory: (c) => {
            const registry = new ToolRegister();

            for (const ToolClass of ToolClasses) {
                registry.register(c.resolve(ToolClass));
            }

            return registry;
        },
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
