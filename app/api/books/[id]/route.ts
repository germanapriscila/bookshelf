import { prisma } from "../../../../lib/prisma";

type BookUpdateBody = {
  title?: string;
  author?: string;
  status?: string;
  genres?: { id: number }[];
  pages?: number;
  currentPage?: number;
  totalPages?: number;
  rating?: number;
  coverUrl?: string;
  synopsis?: string;
  isbn?: number;
  notes?: string;
};

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = (await request.json()) as BookUpdateBody;

  if (Object.keys(body).length === 0) {
    return Response.json(
      { error: "Nenhum campo alterado para atualização." },
      { status: 400 }
    );
  }

  try {
    const { genres, ...rest } = body;
    const data: any = { ...rest };
    const bookId = Number(id);

    if (genres) {
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

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

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
  } catch (error) {
    return Response.json({ error: "Erro ao deletar livro." }, { status: 500 });
  }
}