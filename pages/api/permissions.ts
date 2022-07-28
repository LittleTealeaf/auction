import { getUser, database, getToken } from "lib/api";
import { NextApiHandler } from "next";

const handler: NextApiHandler =  async (request, response) => {

    const token = await getToken(request);


    if(token == null) {
        return response.status(400).json({error: "Please include authentication"});
    }

    const permissions = await database.permissions.findFirst({
        where: {
            id: token.permissionsId
        }
    })

    response.status(200).json(permissions);
}


export default handler;
