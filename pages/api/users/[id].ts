import { database, toUserData } from "lib/api/database";
import { apiHandler, getRequestUser } from "lib/api/handler";

export default apiHandler({
    GET: async (request, response) => {
        const requestingUser = await getRequestUser(request);
        const { id } = request.query;

        if (!requestingUser || (requestingUser.id != Number(id) && !requestingUser.manageUsers)) {
            return response.status(401).json({ message: "Unauthorized" });
        }

        const user = await database.user.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        response.status(200).json({
            user: toUserData(user),
        });
    },
});
