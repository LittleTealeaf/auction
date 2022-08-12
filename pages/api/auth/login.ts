import { Session } from "@prisma/client";
import { database, toUserData } from "src/api/database";
import { apiHandler, respondError } from "src/api/handler";
import { hashPassword } from "src/api/security";
import config from "src/config";

export default apiHandler({
    GET: async (request, response) => {
        const sid = String(request.headers.authorization);
        const session: Session | null = await database.session.findFirst({ where: { sid } });

        if (!session || (session.expires && session.expires?.getTime() < new Date().getTime())) {
            return respondError(response, 401, "Authorization key not valid");
        }

        const user = await database.user.findFirst({
            where: {
                id: session.userId,
            },
        });

        if (!user) {
            return respondError(response, 500, `User ID ${session.userId} not found`);
        }

        response.status(200).json({
            user: toUserData(user),
        });
    },
    POST: async (request, response) => {
        const { username, password, newPassword } = request.query as { username?: string; password?: string; newPassword?: string };
        const hashed = hashPassword(password || "");

        const user = await database.user.findFirst({
            where: {
                username,
                password: hashed,
            },
        });

        if (!user) {
            return respondError(response, 403, "Username or Password incorrect");
        }
        const session = await database.session.create({
            data: {
                userId: user.id,
                expires: new Date(Date.now() + config.session.expireTime),
            },
        });

        response.status(200).json({
            sid: session.sid,
            user: toUserData(user),
        });
    },
    DELETE: async (request, response) => {
        await database.session
            .update({
                where: {
                    sid: request.headers.authorization,
                },
                data: {
                    expires: new Date(),
                },
            })
            .then((session) => {
                response.status(202).json({
                    terminatedSid: session.sid,
                });
            })
            .catch((error) => {
                response.status(500).json({
                    message: "Interal Server Error",
                    error,
                });
            });
    },
});
