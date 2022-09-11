import { apiHandler, respondError, returnResponse } from "src/api/api_wrapper";
import { database } from "src/database";

export default apiHandler({
  POST: async (request, response) => {
    const { username, password: raw_password } = request.query as { username?: string; password?: string };

    if (!username) {
      return respondError(response, 400, "Please include a username");
    }

    if (!raw_password) {
      return respondError(response, 400, "Please include a password");
    }

    const user = await database.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return respondError(response, 404, "User not found");
    }

    // Hash password
    const password = raw_password;

    if (user.password !== password) {
      return respondError(response, 401, "Invalid Password");
    }

    const session = await database.session.create({
      data: {
        userId: user.id,
      },
    });

    returnResponse(response, 200, { sid: session.sid });
  },
  DELETE: async (request, response) => {
    const { sid } = request.query as { sid?: string };

    if (!sid) {
      return respondError(response, 401, "Please include a sid");
    }

    await database.session.delete({
      where: {
        sid,
      },
    });

    returnResponse(response, 200, {});
  },
});
