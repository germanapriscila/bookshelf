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

export async function GET() {
    return NextResponse.json(global.books);
}

export async function POST(request: Request) {
    try {
        const book: Book = await request.json();

        // Generate a new ID (in production, this would be handled by a database)
        const newId = (global.books.length + 1).toString();

        const newBook = {
            ...book,
            id: newId,
            createdAt: new Date(),
        };

        global.books.push(newBook);

        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Dados do livro inválidos' },
            { status: 400 }
        );
    }
}