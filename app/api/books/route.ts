import { Book } from "@/app/types/book";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(books);
}

export async function POST(request: Request) {
  const body: Book = await request.json();

  const {
    title,
    author,
    genres,
    pages,
    totalPages,
    currentPage,
    status,
    rating,
    coverUrl,
    synopsis,
    isbn,
    notes,
  } = body;

  const genreArray = Array.isArray(genres) ? genres : [];

  if (!title || !author) {
    return Response.json(
      { error: "Título e autor são obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        genres: {
          connect: genreArray.map((g: { id: number }) => ({ id: g.id })),
        },
        pages: pages ? Number(pages) : null,
        totalPages: totalPages ? Number(totalPages) : null,
        currentPage: currentPage ? Number(currentPage) : null,
        status: status || null,
        rating: rating ? Number(rating) : null,
        coverUrl: coverUrl || null,
        synopsis: synopsis || null,
        isbn: isbn || null,
        notes: notes || null,
      },
      include: {
        genres: true,
      },
    });

    return Response.json(newBook, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Erro ao criar livro." }, { status: 500 });
  }

}
