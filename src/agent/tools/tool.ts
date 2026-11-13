import type {FunctionTool} from "openai/resources/responses/responses";
export abstract class Tool<TArgs> {
    abstract readonly tool: FunctionTool;

    abstract parseArgs(args: unknown): TArgs;
    abstract exec(args: TArgs): Promise<string>;

    public async execute(args:string): Promise<string>{
        let tmp = this.parseArgs(JSON.parse(args));
        return await this.exec(tmp);
    }
}
