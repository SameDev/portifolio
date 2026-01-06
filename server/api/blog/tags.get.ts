import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        tags: true,
      },
    });

    const tagsMap = new Map<string, number>();

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
      });
    });

    const tags = Array.from(tagsMap.entries()).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => b.count - a.count);

    return {
      success: true,
      tags,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar tags",
    });
  }
});
