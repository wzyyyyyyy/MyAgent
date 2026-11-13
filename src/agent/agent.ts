import type {LLM} from "../llm/llm.js";
import type {ResponseInput, ResponseStreamEvent} from "openai/resources/responses/responses";
import {toResponseInputItems} from "openai/lib/responses/ResponseInputItems";
import type {ToolRegistry} from "./tools/tool_registry.js";

export class Agent {
    private history: ResponseInput = [];

    constructor(
        private readonly llm:LLM,
        private readonly model:string,
        private readonly tools:ToolRegistry,
    ) {}

    public async *run(prompt:string){
        const input: ResponseInput = [
            ...this.history,
            { role: "user", content: prompt },
        ];
        this.history = yield* this.runLoop(input, 10);
    }

    private async* runLoop(
        input: ResponseInput,
        maxSteps: number,
    ): AsyncGenerator<ResponseStreamEvent, ResponseInput, void> {
        for (let i = 0;i < maxSteps;i++){
            const stream = this.llm.generateStream({
                model: this.model,
                instructions: "you are a helpful assistant",
                input,
                tools: this.tools.definitions(),
            });
            try {
                for await (const event of stream) {
                    yield event;
                }

                const response = await stream.finalResponse();

                if (response.status !== "completed") {
                    throw new Error(
                        response.error?.message ??
                        `模型请求未完成：${response.status}`,
                    );
                }

                input.push(...toResponseInputItems(response.output));

                const calls = response.output.filter(
                    x => x.type === "function_call");

                if (calls.length === 0) {
                    return input;
                }

                for (const call of
                    calls) {
                    const result = await this.tools.execute(call);
                    input.push(result);
                }

            }
            finally {
                if (!stream.ended) {
                    stream.abort();
                }
            }
        }

        throw new Error(`Agent 已达到最大执行轮数：${maxSteps}`);
    }
}
