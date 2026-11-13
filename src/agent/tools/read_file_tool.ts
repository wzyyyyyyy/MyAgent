import {Tool} from "./tool.js";
import type {FunctionTool} from "openai/resources/responses/responses";
import {readFile} from "node:fs/promises";

export class ReadFileTool extends Tool<{
    path:string;
    encoding: BufferEncoding;
}> {
    readonly definition: FunctionTool = {
        description: "读取文件",
        name: "read_file",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "要读取的文件的路径",
                },
                encoding:{
                    type: "string",
                    description: "编码格式",
                }
            },
            required: ["path", "encoding"],
            additionalProperties: false,
        },
        strict: false,
        type: "function"
    };

    parseArgs(args: unknown): { path: string; encoding: BufferEncoding; } {
        if (
            typeof args !== "object" ||
            args === null ||
            !("path" in args) ||
            typeof args.path !== "string"
        ) {
            throw new Error("path 必须是字符串");
        }

        let encoding: BufferEncoding = "utf8";

        if ("encoding" in args && args.encoding != null) {
            if (
                typeof args.encoding !== "string" ||
                !Buffer.isEncoding(args.encoding)
            ) {
                throw new Error("encoding 不是有效的编码格式");
            }

            encoding = args.encoding;
        }

        return {
            path: args.path,
            encoding: encoding
        };
    }

    protected async exec(args: { path: string; encoding: BufferEncoding; }): Promise<string> {
        try {
            let content = await readFile(args.path, args.encoding);

            return JSON.stringify({
                content,
                exitCode: 0
            });
        } catch (error) {
            const err = error as Error & {
                stdout?: string;
                stderr?: string;
                code?: number | string;
            };

            return JSON.stringify({
                stdout: err.stdout ?? "",
                stderr: err.stderr ?? err.message,
                exitCode: err.code ?? null
            });
        }
    }

}