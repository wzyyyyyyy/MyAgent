import OpenAI from "openai";
import type {ResonseStreamParams} from "openai/resources/responses"

export class LLM {
    private client = new OpenAI();
    constructor(
        private readonly baseUrl: string,
        private readonly apikey: string,
        ) {}

    public generate(params: ResonseStreamParams) {
        return this.client.responses.stream(params);
    }


}