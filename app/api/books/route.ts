import { supabase } from "../../../lib/supabase";

// GET - listar livros (com filtro opcional)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term")?.toLowerCase() ?? "";

  const { data, error } = await supabase
    .from("books")
    .select(`
      *,
      book_genres(
        genre_id,
        genres(id, title)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json(
      { error: "Erro ao buscar livros", details: error.message },
      { status: 500 }
    );
  }

  const books = (data ?? []).map((book: any) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    status: book.status,
    pages: book.pages,
    totalPages: book.total_pages,
    currentPage: book.current_page,
    rating: book.rating,
    coverUrl: book.cover_url,
    synopsis: book.synopsis,
    isbn: book.isbn,
    notes: book.notes,
    createdAt: book.created_at,
    genres: (book.book_genres ?? []).map((bg: any) => ({
      id: bg.genres?.id,
      title: bg.genres?.title ?? "",
    })),
  }));

  if (!term) return Response.json(books);

  const filtered = books.filter((book) =>
    book.title?.toLowerCase().includes(term) ||
    book.author?.toLowerCase().includes(term) ||
    (book.synopsis ?? "").toLowerCase().includes(term) ||
    book.genres?.some((g: { title: any; }) => (g.title ?? "").toLowerCase().includes(term))
  );

  return Response.json(filtered);
}

// POST - criar livro
export async function POST(request: Request) {
  const body = await request.json();
  const {
    title,
    author,
    status,
    pages,
    totalPages,
    currentPage,
    rating,
    coverUrl,
    synopsis,
    isbn,
    notes,
    genres,
  } = body;

  if (!title || !author || !status) {
    return Response.json(
      { error: "Título, autor e status são obrigatórios" },
      { status: 400 }
    );
  }

  const genreArray = Array.isArray(genres) ? genres : [];

  try {
    // 1️⃣ Inserir livro
    const { data: bookData, error: bookError } = await supabase
      .from("books")
      .insert([
        {
          title,
          author,
          status,
          pages: pages ?? null,
          total_pages: totalPages ?? null,
          current_page: currentPage ?? null,
          rating: rating ?? null,
          cover_url: coverUrl ?? null,
          synopsis: synopsis ?? null,
          isbn: isbn ?? null,
          notes: notes ?? null,
        },
      ])
      .select();

    if (bookError) throw bookError;
    const bookId = bookData[0].id;

    // 2️⃣ Inserir gêneros
    if (genreArray.length > 0) {
      const bookGenres = genreArray.map((g: any) => ({
        book_id: bookId,
        genre_id: g.id,
      }));
      const { error: bgError } = await supabase
        .from("book_genres")
        .insert(bookGenres);
      if (bgError) throw bgError;
    }

    // 3️⃣ Retornar livro com gêneros (com JOIN correto)
    const { data: insertedBook, error: fetchError } = await supabase
      .from("books")
      .select(`
        *,
        book_genres(
          genre_id,
          genres(id, title)
        )
      `)
      .eq("id", bookId)
      .single();

    if (fetchError) throw fetchError;

    return Response.json(
      {
        ...insertedBook,
        genres: (insertedBook.book_genres ?? []).map((bg: any) => ({
          id: bg.genres?.id,
          title: bg.genres?.title ?? "",
        })),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Erro ao criar livro", details: (err as Error).message },
      { status: 500 }
    );
  }
}