import type {FunctionTool} from "openai/resources/responses/responses";
export abstract class Tool<TArgs> {
    abstract readonly definition: FunctionTool;

    abstract parseArgs(args: unknown): TArgs;
    protected abstract exec(args: TArgs): Promise<string>;

    public async execute(rawArgs:string): Promise<string>{
        const parsedArgs = this.parseArgs(JSON.parse(rawArgs));
        return await this.exec(parsedArgs);
    }
}
