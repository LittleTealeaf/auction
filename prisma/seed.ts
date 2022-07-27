import { PrismaClient, Role, User } from "@prisma/client";

const roles: Role[] = [
    {
        id: 1,
        name: "Admin",
        customerRead: true,
        customerWrite: true,
        customerCreate: true,
        customerDelete: true,
        bidderRead: true,
        bidderWrite: true,
        bidderCreate: true,
        bidderDelete: true,
        itemRead: true,
        itemWrite: true,
        itemCreate: true,
        itemDestroy: true,
        userRead: true,
        userWrite: true,
        userCreate: true,
        userDelete: true,
    },
];

const users: User[] = [
    {
        username: "admin",
        password: "admin",
        id: 1,
        roleId: 1,
    },
];

const db = new PrismaClient();

Promise.all(roles.map((data) => db.role.create({ data })));
Promise.all(users.map((data) => db.user.create({ data })));
