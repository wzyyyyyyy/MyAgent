import OpenAI from "openai";
import type {ResponseStreamParams} from "openai/lib/responses/ResponseStream";

export class LLM {
    private client;
    constructor(
        private readonly baseURL: string,
        private readonly apiKey: string,
        ) {
        this.client = new OpenAI({
            baseURL: baseURL,
            apiKey: apiKey,
        })
    }

    public generateStream(params: ResponseStreamParams) {
        return this.client.responses.stream(params);
    }
}