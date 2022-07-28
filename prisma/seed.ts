import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const permAdmin = db.permissions.create({
    data: {
        name: "admin",
        manageUser: true,
    },
});

const permUser = db.permissions.create({
    data: {
        name: "user",
        manageUser: false,
    },
});

const accountAdmin = permAdmin.then((admin) =>
    db.user.create({
        data: {
            username: "admin",
            permissionsId: admin.id,
        },
    })
);


Promise.all([permAdmin,permUser,accountAdmin]).catch(console.log);
