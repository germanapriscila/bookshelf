import { Genre } from "@/app/types/book";
import { prisma } from "../../../lib/prisma";

export async function GET() {
    const genres = await prisma.genre.findMany({
        orderBy: {
          title: "asc"
      }
  });

  return Response.json(genres);
}

export async function POST(request: Request) {
  const body: Genre = await request.json();

  const { title, description } = body;

  if (!title) {
    return Response.json({ error: "Título é obrigatório." }, { status: 400 });
  }

  try {
    const newGenre = await prisma.genre.create({
      data: {
        title: title,
        description: description,
      },
    });

    return Response.json(newGenre, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Erro ao criar gênero." }, { status: 500 });
  }
}
