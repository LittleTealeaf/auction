import { createHmac } from "crypto";
import { passwordHash } from "./secrets";

export function hashPassword(password: string) {
    return createHmac("sha256", passwordHash).update(password).digest("hex");
}
