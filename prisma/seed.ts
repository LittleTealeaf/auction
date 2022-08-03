import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

Promise.all([
    db.user
        .findFirst({
            where: {
                username: "admin",
            },
        })
        .then((user) => {
            if (user == null) {
                return db.user.create({
                    data: {
                        username: "admin",
                        password: "admin",
                        manageUsers: true,
                        protected: true,
                    },
                });
            } else {
                return db.user.update({
                    where: {
                        username: "admin",
                    },
                    data: {
                        username: "admin",
                        password: "admin",
                        protected: true,
                        manageUsers: true,
                    },
                });
            }
        }),
]);
