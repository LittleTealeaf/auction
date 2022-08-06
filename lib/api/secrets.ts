import { existsSync, readFile, readFileSync, writeFileSync } from "fs";

const fn = "./.env.json";

var existed: {
    password?: string;
} = {};

function makeid(length: number) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function ensureKey(value: string | undefined) {
    return value || makeid(50);
}

if (existsSync(fn)) {
    const buffer = readFileSync(fn).toString();
    existed = JSON.parse(buffer);
}

const secrets = {
    password: ensureKey(existed?.password),
};

writeFileSync(fn,JSON.stringify(secrets));

export const { password } = secrets;
