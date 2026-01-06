import { z } from "zod";
import prisma from "../../utils/prisma";
import { requireAuth } from "../../utils/auth";
import { readBody } from "h3";

const createPostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens",
    ),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  excerpt: z.string().optional(),
  coverImage: z
    .string()
    .url("URL da imagem inválida")
    .optional()
    .or(z.literal("")),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const payload = await requireAuth(event);

    const body = await readBody(event);
    const data = createPostSchema.parse(body);

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      throw createError({
        statusCode: 409,
        message: "Já existe um post com este slug",
      });
    }

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage || null,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
        tags: data.tags,
        category: data.category,
        authorId: payload.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      post,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 400,
      message: error.message || "Erro ao criar post",
    });
  }
});
