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
        const bookData = await request.json();

        if (!bookData.title || !bookData.author || !bookData.status) {
            return NextResponse.json(
                { error: 'Título, autor e status são obrigatórios' },
                { status: 400 }
            );
        }

        // Generate a unique ID using timestamp and random number
        const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newBook: Book = {
            ...bookData,
            id: newId,
            createdAt: new Date(),
            currentPage: bookData.currentPage ? Number(bookData.currentPage) : 0,
            totalPages: bookData.totalPages ? Number(bookData.totalPages) : undefined,
            rating: bookData.rating ? Number(bookData.rating) : undefined
        };

        global.books.push(newBook);

        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        console.error('Error creating book:', error);
        return NextResponse.json(
            { error: 'Erro ao criar livro' },
            { status: 500 }
        );
    }
}