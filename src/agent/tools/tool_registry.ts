import type {Tool} from "./tool.js";
import type {ResponseFunctionToolCall, ResponseInputItem} from "openai/resources/responses/responses";

export class ToolRegistry{
    private readonly tools = new Map<string, Tool<unknown>>();

    public register(tool: Tool<unknown>): void {
        const name = tool.definition.name;

        if (!name.trim()) {
            throw new Error("工具名称不能为空");
        }

        if (this.tools.has(name)) {
            throw new Error(`工具名称重复：${name}`);
        }

        this.tools.set(name, tool);
    }

    public async execute(call: ResponseFunctionToolCall): Promise<ResponseInputItem.FunctionCallOutput>{
        let tool = this.tools.get(call.name);
        let output = "";

        try {
            if (!tool) {
                throw new Error(`未注册的工具：${call.name}`);
            }
            output = await tool.execute(call.arguments);
        } catch (error) {
            output = JSON.stringify({
                error: error instanceof Error
                    ? error.message
                    : String(error),
            });
        }


        return {
            type: "function_call_output",
            call_id: call.call_id,
            output,
        };
    }

    public definitions(){
        return [...this.tools.values()].map((tool) => tool.definition);
    }
}