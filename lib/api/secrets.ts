import { existsSync, readFile, readFileSync, writeFileSync } from "fs";
import {randomBytes} from 'crypto';

function randomHash() {
    return randomBytes(20).toString('hex');
}

if (!existsSync(".env.json")) {
    const data = {
        SECRET_JWT: randomHash(),
    };

    writeFileSync(".env.json", JSON.stringify(data));
}

const secrets = JSON.parse(readFileSync(".env.json", "utf8"));

export const { SECRET_JWT } = secrets;
