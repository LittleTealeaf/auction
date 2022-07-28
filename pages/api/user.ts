import { getUser, database } from "lib/api";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (request, response) => {
    const user = await getUser(request);

    if (user == null) return response.status(401).json({ error: "Authorization Token not found" });

    const permissions = await database.permissions.findFirstOrThrow({
        where: {
            id: user.permissionsId,
        },
    });

    if (!permissions.manageUser) return response.status(403).json({ error: "User not authorized" });

    response.status(200).json(await database.user.findMany());
};

export default handler;
