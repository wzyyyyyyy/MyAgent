import {Tool} from "./tool.js"
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import type {FunctionTool} from "openai/resources/responses/responses";

const execFileAsync = promisify(execFile);

export class Bash extends Tool<{cmd:string}>{
    readonly tool: FunctionTool = {
        description: "在项目当前工作目录中执行 Bash 命令，返回标准输出、标准错误和退出码。",
        name: "bash",
        parameters: {
            type: "object",
            properties: {
                cmd: {
                    type: "string",
                    description: "要执行的 Bash 命令",
                },
            },
            required: ["cmd"],
            additionalProperties: false,
        },
        strict: true,
        type: "function"
    };

    parseArgs(args: unknown): { cmd: string } {
        if (
            typeof args !== "object" ||
            args === null ||
            !("cmd" in args) ||
            typeof args.cmd !== "string"
        ) {
            throw new Error("cmd 必须是字符串");
        }

        return { cmd: args.cmd };
    }

    async exec(args: { cmd: string }): Promise<string> {
        try {
            const { stdout, stderr } = await execFileAsync(
                "/bin/bash",
                ["-lc", args.cmd],
                {
                    timeout: 10000,
                    maxBuffer: 1024 * 1024,
                    cwd: process.cwd()
                }
            );

            return JSON.stringify({
                stdout,
                stderr,
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
