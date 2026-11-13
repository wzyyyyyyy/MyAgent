import type {Tool} from "./tool.js";
import {BashTool} from "./bash_tool.js";
import {WriteFileTool} from "./write_file_tool.js";
import {ReadFileTool} from "./read_file_tool.js";

export const ToolClasses: Array<new () => Tool<unknown>> = [
    BashTool,
    WriteFileTool,
    ReadFileTool,
];
