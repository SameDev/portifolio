import prisma from "../../utils/prisma";
import { extractToken, verifyToken } from "../../utils/auth";
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Check Authentication
    const token = extractToken(event);
    const user = token ? verifyToken(token) : null;
    const isAdmin = !!user; // Simplified, assuming any valid user is admin for now

    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const tag = query.tag as string | undefined;
    const category = query.category as string | undefined;
    const search = query.search as string | undefined;
    const year = query.year ? parseInt(query.year as string) : undefined;
    const month = query.month ? parseInt(query.month as string) : undefined;
    const day = query.day ? parseInt(query.day as string) : undefined;
    const publishedFilter = query.published as string | undefined;

    const skip = (page - 1) * limit;

    const where: any = {};

    // Logic:
    // If Admin: Can see all (defaults to all unless filtered).
    // If Public: MUST see only published.
    
    if (isAdmin) {
      if (publishedFilter !== undefined) {
        where.published = publishedFilter === "true";
      }
      // If not specified, show all
    } else {
      where.published = true;
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    // Date Filtering
    if (year) {
      let startDate: Date;
      let endDate: Date;

      if (month) {
        if (day) {
          // Specific Day
          startDate = new Date(year, month - 1, day);
          endDate = new Date(year, month - 1, day + 1);
        } else {
          // Specific Month
          startDate = new Date(year, month - 1, 1);
          endDate = new Date(year, month, 1);
        }
      } else {
        // Specific Year
        startDate = new Date(year, 0, 1);
        endDate = new Date(year + 1, 0, 1);
      }

      // If user is admin and looking at drafts, this might filter by publishedAt which is null for drafts.
      // Filter logic: If we are filtering by date, we probably assume published posts or we check publishedAt.
      // Drafts have publishedAt: null usually?
      // schema: publishedAt DateTime?
      // If date filter is active, we check publishedAt. Drafts won't show up in date archives unless we check createdAt?
      // Typically blog archives are by published date.
      
      where.publishedAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          // If admin wants to see drafts, maybe order by createdAt default for admin?
          // For now keep publishedAt desc, drafts (null) might be last or first depending on DB.
          // Let's use createdAt for admin listing consistency if filtered, or publishedAt for public.
          // Actually, let's stick to publishedAt desc, but handle nulls?
          // Prisma: sort order.
          publishedAt: "desc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          coverImage: true,
          published: true, // sending published status to admin
          publishedAt: true,
          tags: true,
          category: true,
          createdAt: true, // useful for admin
          updatedAt: true, // useful for admin
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar posts",
    });
  }
});
