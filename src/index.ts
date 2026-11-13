import "reflect-metadata";
import {container, instanceCachingFactory} from "tsyringe";
import {Agent} from "./agent/agent.js"
import {LLM} from "./llm/llm.js";
import {startCli} from "./cli/app.js";
import {ToolRegister} from "./agent/tools/register.js";
import {Bash} from "./agent/tools/bash.js";

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
        useFactory: (c) => new Agent(c.resolve(LLM), model,c.resolve(ToolRegister)),
    });

    registerTools();
    container.register(ToolRegister, {
        useFactory: (c) => {
            let register = new ToolRegister();
            register.register(c.resolve(Bash));
            return register;
        }});

    const agent = container.resolve(Agent);
    await startCli(agent);
}

function registerTools(){
    container.register(Bash, {
        useFactory: instanceCachingFactory(() => new Bash()),
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});