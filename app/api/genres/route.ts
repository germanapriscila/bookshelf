import { supabase } from "@/lib/supabase";

// GET - listar todos os gêneros
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("genres")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      console.error("Erro ao buscar gêneros:", error);
      return Response.json(
        { error: "Erro ao buscar gêneros", details: error.message },
        { status: 500 }
      );
    }

    return Response.json(data || []);
  } catch (err) {
    console.error("Erro ao buscar gêneros:", err);
    return Response.json(
      { error: "Erro ao buscar gêneros", details: (err as Error).message },
      { status: 500 }
    );
  }
}

// POST - criar novo gênero
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return Response.json(
        { error: "Título é obrigatório" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("genres")
      .insert([{ title, description: description || null }])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar gênero:", error);
      return Response.json(
        { error: "Erro ao criar gênero", details: error.message },
        { status: 500 }
      );
    }

    return Response.json(data, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar gênero:", err);
    return Response.json(
      { error: "Erro ao criar gênero", details: (err as Error).message },
      { status: 500 }
    );
  }
}