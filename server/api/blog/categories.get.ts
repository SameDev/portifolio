export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.blogPost.findMany({
      where: {
        published: true,
        category: {
          not: null,
        },
      },
      distinct: ["category"],
      select: {
        category: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    return {
      success: true,
      categories: categories.map((c) => c.category).filter(Boolean),
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar categorias",
    });
  }
});
