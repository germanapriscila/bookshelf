import { supabase } from "@/lib/supabase";

// DELETE - remover gênero
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = Number(paramId);
    
    if (!id || isNaN(id)) {
      return Response.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar se há livros usando este gênero
    const { data: booksWithGenre } = await supabase
      .from("book_genres")
      .select("*")
      .eq("genre_id", id)
      .limit(1);

    if (booksWithGenre && booksWithGenre.length > 0) {
      return Response.json(
        { error: "Não é possível excluir um gênero que está sendo usado por livros" },
        { status: 400 }
      );
    }

    // Deletar o gênero
    const { error } = await supabase
      .from("genres")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar gênero:", error);
      return Response.json(
        { error: "Erro ao deletar gênero", details: error.message },
        { status: 500 }
      );
    }

    return Response.json({ message: "Gênero deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar gênero:", err);
    return Response.json(
      { error: "Erro ao deletar gênero", details: (err as Error).message },
      { status: 500 }
    );
  }
}