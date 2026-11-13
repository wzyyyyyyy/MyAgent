import {Tool} from "./tool.js";
import type {FunctionTool} from "openai/resources/responses/responses";
import {readFile, writeFile} from "node:fs/promises";

export class WriteFileTool extends Tool<{
    path:string;
    content:string;
    encoding: BufferEncoding;
}> {
    readonly definition: FunctionTool = {
        description: "写文件",
        name: "write_file",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "要写入的文件的路径",
                },
                content: {
                    type: "string",
                    description: "要写入的内容",
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

    parseArgs(args: unknown): {
        path:string;
        content:string;
        encoding: BufferEncoding;
    } {
        if (
            typeof args !== "object" ||
            args === null ||
            !("path" in args) ||
            typeof args.path !== "string"
        ) {
            throw new Error("path 必须是字符串");
        }

        let content = "";
        if ("content" in args && args.content != null) {
            if (typeof args.content !== "string"){
                throw new Error("content 必须是字符串");
            }

            content = args.content;
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
            content: content,
            encoding: encoding
        };
    }

    protected async exec(args: {
        path:string;
        content:string;
        encoding: BufferEncoding;
    }): Promise<string> {
        try {
            await writeFile(args.path, args.content, args.encoding);
            return JSON.stringify({
                success: true,
                stderr: "",
                exitCode: 0
            });
        } catch (error) {
            const err = error as Error & {
                success: boolean;
                stderr?: string;
                code?: number | string;
            };

            return JSON.stringify({
                success: false,
                stderr: err.stderr ?? err.message,
                exitCode: err.code ?? null
            });
        }
    }

}