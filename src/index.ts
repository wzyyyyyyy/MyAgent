import "reflect-metadata";
import {container, instanceCachingFactory} from "tsyringe";
import {Agent} from "./agent/agent.js"
import {LLM} from "./llm/llm.js";
import {startCli} from "./cli/app.js";

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
        useFactory: (c) => new Agent(c.resolve(LLM), model),
    });

    const agent = container.resolve(Agent);
    await startCli(agent);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});