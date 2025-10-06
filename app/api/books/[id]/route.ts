import { prisma } from "../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return Response.json(
      { error: "ID é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: {
        genres: true,
      },
    });

    if (!book) {
      return Response.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }

    return Response.json(book, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Erro ao buscar livro." },
      { status: 500 }
    );
  }
}

type BookUpdateBody = {
  title?: string;
  author?: string;
  status?: string;
  genres?: { id: number }[];
  genreIds?: number[];
  pages?: number;
  currentPage?: number;
  totalPages?: number;
  rating?: number;
  coverUrl?: string;
  synopsis?: string;
  isbn?: number;
  notes?: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = (await request.json()) as BookUpdateBody;

  if (Object.keys(body).length === 0) {
    return Response.json(
      { error: "Nenhum campo alterado para atualização." },
      { status: 400 }
    );
  }

  try {
    const { genres, genreIds, ...rest } = body;
    const data: any = { ...rest };
    const bookId = Number(id);

    if (genreIds) {
      data.genres = {
        set: genreIds.map((id) => ({ id: Number(id) })),
      };
    } else if (genres) {
      data.genres = {
        set: genres.map((g) => ({ id: Number(g.id) })),
      };
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: data,
      include: {
        genres: true,
      },
    });

    return Response.json(updatedBook, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Erro ao atualizar livro." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return Response.json(
      { error: "ID é obrigatório para exclusão." },
      { status: 400 }
    );
  }

  try {
    await prisma.book.delete({
      where: { id: Number(id) },
    });

    return Response.json(
      { message: "Livro deletado com sucesso." },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: "Erro ao deletar livro." }, { status: 500 });
  }
}