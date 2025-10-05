import { prisma } from "../../../../lib/prisma";
import { Genre } from "../../../types/book";


export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body: Partial<Genre> = await request.json();
  const { title, description } = body;

  if (!id) {
    return Response.json(
      { error: "ID é obrigatório para atualização." },
      { status: 400 }
    );
  }

  try {
    const updatedGenre = await prisma.genre.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
      },
    });

    return Response.json(updatedGenre, { status: 200 });

  } catch (error) {
    return Response.json(
      { error: "Erro ao atualizar gênero." },
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
    await prisma.genre.delete({
      where: { id: Number(id) },
    });

    return Response.json(
      { message: "Gênero deletado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: "Erro ao deletar gênero." },
      { status: 500 }
    );
  }
}