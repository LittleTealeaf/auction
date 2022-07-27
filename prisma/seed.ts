import { PrismaClient, Role, User } from "@prisma/client";

const roles: Role[] = [
    {
        id: 1,
        name: "Admin",
        customerRead: true,
        customerWrite: true,
        userAdmin: true,
        auctionItemRead: true,
        auctionItemWrite: true,
        winnerRead: true,
        winnerWrite: true,
        bidderRead: true,
        bidderWrite: true,
    },
];

const users: User[] = [
    {
        username: "admin",
        password: null,
        id: 1,
        roleId: 1,
    },
];

const db = new PrismaClient();

Promise.all(roles.map((data) => db.role.create({ data })));
Promise.all(users.map((data) => db.user.create({ data })));
