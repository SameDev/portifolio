import { z } from "zod";
import prisma from "../../utils/prisma";
import { verifyPassword, generateToken } from "../../utils/auth";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Credenciais inválidas",
      });
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: "Credenciais inválidas",
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 400,
      message: error.message || "Erro ao fazer login",
    });
  }
});
