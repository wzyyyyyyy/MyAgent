import OpenAI from "openai";
import type {ResponseStreamParams} from "openai/lib/responses/ResponseStream";

export class LLM {
    private client;
    constructor(
        private readonly baseUrl: string,
        private readonly apikey: string,
        ) {
        this.client = new OpenAI({
            baseURL: baseUrl,
            apiKey: apikey,
        })
    }

    public generateStream(params: ResponseStreamParams) {
        return this.client.responses.stream(params);
    }
}