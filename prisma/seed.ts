import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const db = new PrismaClient();

Promise.all([
    hash("admin").then((password) =>
        db.user.create({
            data: {
                username: "admin",
                password: 'admin',
                manageUsers: true,
            },
        })
    ),
]);
