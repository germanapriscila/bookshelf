import { NextResponse } from 'next/server';
import { Book, Genre } from '@/app/types/book';
import { initialBooks } from '@/data/initialBooks';

let books = [...initialBooks];

const allGenres: Genre[] = [
    'Literatura Brasileira',
    'Ficção Científica',
    'Realismo Mágico',
    'Ficção',
    'Fantasia',
    'Romance',
    'Biografia',
    'História',
    'Autoajuda',
    'Tecnologia',
    'Programação',
    'Negócios',
    'Psicologia',
    'Filosofia',
    'Poesia'
];

export async function GET() {
    // Get unique genres from books and combine with predefined genres
    const usedGenres = new Set(books.map(book => book.genre).filter(Boolean));
    const availableGenres = new Set([...allGenres, ...usedGenres]);

    return NextResponse.json(Array.from(availableGenres));
}

export async function POST(request: Request) {
    try {
        const { genre }: { genre: string } = await request.json();

        if (!genre) {
            return NextResponse.json(
                { error: 'Genre is required' },
                { status: 400 }
            );
        }

        if (allGenres.includes(genre as Genre)) {
            return NextResponse.json(
                { error: 'Genre already exists' },
                { status: 400 }
            );
        }

        // Add new genre to the predefined list
        allGenres.push(genre as Genre);

        return NextResponse.json({ genre }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid genre data' },
            { status: 400 }
        );
    }
}