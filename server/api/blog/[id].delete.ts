import prisma from "../../utils/prisma";
import { requireAuth } from "../../utils/auth";
import { getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event);

    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        message: "ID não fornecido",
      });
    }

    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        message: "Post não encontrado",
      });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Post deletado com sucesso",
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Erro ao deletar post",
    });
  }
});
