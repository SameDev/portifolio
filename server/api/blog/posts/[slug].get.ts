import prisma from "../../../utils/prisma";

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
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        coverImage: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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

    // Se o post não está publicado, retornar 404 (exceto se for admin)
    if (!post.published) {
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
