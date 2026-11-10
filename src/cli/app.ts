import {createInterface} from "node:readline/promises";

export async function startCli() {
    const rl = createInterface({input: process.stdin, output: process.stdout});
    while (true) {
        let prompt = await rl.question("user:");

    }
}