import { PrismaClient } from "@prisma/client";


const db = new PrismaClient();

Promise.all([
    db.user.create({
        data: {
            username: "admin",
            password: 'admin',
            manageUsers: true,
        },
    })
]);
