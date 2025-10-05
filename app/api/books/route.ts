import { prisma } from "../../../lib/prisma";

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      genres: true,
    },
  });

  return Response.json(books);
}

export async function POST(request: Request) {
  const body = await request.json();

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

  if (!title || !author || !status) {
    return Response.json(
      { error: "Título, autor e status são obrigatórios" },
      { status: 400 }
    );
  }

  if (!['TO_READ', 'READING', 'READ', 'PAUSED', 'FINISHED', 'ABANDONED'].includes(status)) {
    return Response.json(
      { error: "Status inválido. Use TO_READ, READING, READ, PAUSED, FINISHED ou ABANDONED" },
      { status: 400 }
    );
  }

  const genreArray = Array.isArray(genres) ? genres : [];

  try {
    // Log dos dados recebidos para debug
    console.log('Dados recebidos:', {
      title,
      author,
      status,
      genres: genreArray,
      pages,
      totalPages,
      currentPage,
      rating,
      coverUrl,
      synopsis,
      isbn,
      notes
    });

    // Preparar os dados base
    const baseData = {
      title,
      author,
      status,
      pages: pages ? Number(pages) : undefined,
      totalPages: totalPages ? Number(totalPages) : undefined,
      currentPage: currentPage ? Number(currentPage) : undefined,
      rating: rating ? Number(rating) : undefined,
      coverUrl: coverUrl || undefined,
      synopsis: synopsis || undefined,
      isbn: isbn ? Number(isbn) : undefined,
      notes: notes || undefined,
    };

    // Criar objeto de dados com possíveis gêneros
    const createData = {
      ...baseData,
      ...(genreArray.length > 0 ? {
        genres: {
          connect: genreArray.map((g: { id: number }) => ({ id: Number(g.id) }))
        }
      } : {})
    };

    // Criar o livro
    const newBook = await prisma.book.create({
      data: createData,
      include: {
        genres: true,
      },
    });

    return Response.json(newBook, { status: 201 });
  } catch (error) {
    // Log do erro para debug
    console.error('Erro ao criar livro:', error);

    if (error instanceof Error) {
      return Response.json({
        error: "Erro ao criar livro",
        details: error.message
      }, { status: 500 });
    }

    return Response.json({
      error: "Erro desconhecido ao criar livro"
    }, { status: 500 });
  }

}
