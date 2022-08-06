import { createHmac } from "crypto";
import { password } from "./secrets";

const secret = password;

export function hashPassword(password: string) {
    return createHmac('sha256',secret).update(password).digest('hex');
}
