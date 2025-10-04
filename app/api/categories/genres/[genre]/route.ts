import { NextResponse } from 'next/server';
import { initialBooks } from '@/data/initialBooks';

let books = [...initialBooks];

export async function DELETE(
    request: Request,
    { params }: { params: { genre: string } }
) {
    const genre = decodeURIComponent(params.genre);

    // Check if any books are using this genre
    const booksUsingGenre = books.filter(book => book.genre === genre);

    if (booksUsingGenre.length > 0) {
        return NextResponse.json(
            { error: 'Cannot delete genre that is being used by books' },
            { status: 400 }
        );
    }

    // In a real application, you would remove the genre from your database
    // Here we'll just return a success response
    return new NextResponse(null, { status: 204 });
}