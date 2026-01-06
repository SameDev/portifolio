import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Try multiple methods to get the slug parameter
    let slug = getRouterParam(event, "slug");

    // Fallback: try to get from context
    if (!slug) {
      const context = event.context;
      slug = context.params?.slug;
    }

    // Fallback: parse from URL path
    if (!slug) {
      const path = event.path || event.node.req.url;
      const match = path?.match(/\/api\/blog\/([^\/\?]+)/);
      slug = match?.[1];
    }

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
