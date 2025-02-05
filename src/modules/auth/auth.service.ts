import prisma from "@/config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { LoginDTO } from "./auth.schema";
import { AppError } from "@/utils/error";
import { env } from "@/const/env";
import { parseJSON } from "@/utils/transformer";

interface User {
  id: number;
  name: string;
  password: string;
  [key: string]: any;
}

const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, name: user.name }, env.JWT_SECRET!, { expiresIn: "1h" });
};

const login = async (data:LoginDTO) => {
  const {email,password} = data;
  const user = await prisma.user.findUnique({ select: {
    id: true,
    name: true,
    role: true,
    password: true,
  },where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new AppError("Invalid email or password",422);
  }
  return {
    name: user.name,
    role: user.role.name,
    permissions : parseJSON(user.role.permissions),
    token: generateToken(user)
  }
};


export default { login };
