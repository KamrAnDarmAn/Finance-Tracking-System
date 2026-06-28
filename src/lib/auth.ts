import jwt from "jsonwebtoken";

export const createAccessToken = async (payload: { userId: string }) => {
  return await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
};

export const createRefereshToken = async (payload: { userId: string }) => {
  return await jwt.sign(payload, process.env.REFERESH_TOKEN_SECRET!);
};
