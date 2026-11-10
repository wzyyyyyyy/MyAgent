import type {LLM} from "../llm/llm.js";
import type {ResponseInput} from "openai/resources/responses/responses";
import {toResponseInputItems} from "openai/lib/responses/ResponseInputItems";

export class Agent {
    private history: ResponseInput = [];

    constructor(
        private readonly llm:LLM,
        private readonly model:string,
    ) {}

    public async *run(prompt:string){
        const input: ResponseInput = [
            ...this.history,
            { role: "user", content: prompt },
        ];

        const stream = this.llm.generateStream({
            model: this.model,
            instructions: "you are a helpful assistant",
            input,
        });

        try {
            for await (const item of stream) {
                if (item.type === "response.completed") {
                    this.history = [
                        ...input,
                        ...toResponseInputItems(item.response.output),
                    ];
                }
                yield item;
            }
        }
        finally {
            if (!stream.ended) {
                stream.abort();
            }
        }
    }
}
