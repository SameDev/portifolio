import { z } from "zod";
import prisma from "../../utils/prisma";
import { requireAuth } from "../../utils/auth";
import { readBody, getRouterParam } from "h3";

const updatePostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").optional(),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens",
    )
    .optional(),
  content: z.string().min(1, "Conteúdo é obrigatório").optional(),
  excerpt: z.string().optional(),
  coverImage: z
    .string()
    .url("URL da imagem inválida")
    .optional()
    .or(z.literal("")),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

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

    const body = await readBody(event);

    const data = updatePostSchema.parse(body);

    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        message: "Post não encontrado",
      });
    }

    if (data.slug && data.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        throw createError({
          statusCode: 409,
          message: "Já existe um post com este slug",
        });
      }
    }

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.coverImage !== undefined)
      updateData.coverImage = data.coverImage || null;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.category !== undefined) updateData.category = data.category;

    if (data.published !== undefined) {
      updateData.published = data.published;

      if (data.published && !existingPost.published) {
        updateData.publishedAt = new Date();
      } else if (!data.published) {
        updateData.publishedAt = null;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
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
      message: error.message || "Erro ao atualizar post",
    });
  }
});
