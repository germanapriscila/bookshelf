import { NextResponse } from 'next/server';
import { initialBooks } from '@/data/initialBooks';
import { Book } from '@/app/types/book';

// Declare o tipo global
declare global {
    var books: Book[];
}

// Inicializa os livros se ainda não existirem
if (!global.books) {
    global.books = [...initialBooks];
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const book = global.books.find((b: Book) => b.id === params.id);

    if (!book) {
        return NextResponse.json(
            { error: 'Livro não encontrado' },
            { status: 404 }
        );
    }

    return NextResponse.json(book);
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const updatedData: Partial<Book> = await request.json();
        const bookIndex = global.books.findIndex((b: Book) => b.id === params.id);

        if (bookIndex === -1) {
            return NextResponse.json(
                { error: 'Livro não encontrado' },
                { status: 404 }
            );
        }

        global.books[bookIndex] = {
            ...global.books[bookIndex],
            ...updatedData,
        };

        return NextResponse.json(global.books[bookIndex]);
    } catch (error) {
        return NextResponse.json(
            { error: 'Dados do livro inválidos' },
            { status: 400 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const bookIndex = global.books.findIndex((b: Book) => b.id === params.id);

        if (bookIndex === -1) {
            return NextResponse.json(
                { error: 'Livro não encontrado' },
                { status: 404 }
            );
        }

        global.books = global.books.filter((b: Book) => b.id !== params.id);

        return NextResponse.json(
            { message: 'Livro excluído com sucesso' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao excluir livro:', error);
        return NextResponse.json(
            { error: 'Falha ao excluir o livro' },
            { status: 500 }
        );
    }
}