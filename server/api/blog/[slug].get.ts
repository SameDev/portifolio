import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, "slug");

    if (!slug) {
      throw createError({
        statusCode: 400,
        message: "Slug não fornecido",
      });
    }

    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!post) {
      throw createError({
        statusCode: 404,
        message: "Post não encontrado",
      });
    }

    return {
      success: true,
      post,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar post",
    });
  }
});
