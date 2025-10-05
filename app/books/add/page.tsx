"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addBook } from "@/app/lib/actions";
import { Book } from "@/types/book";

export default function AddBookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Omit<Book, "id" | "createdAt">>>({
    status: "to-read", // Default status
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    try {
      const url = new URL(value);
      setImageUrl(url.href);
    } catch (error) {
      setImageUrl(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.status) {
      // Basic validation
      return;
    }
    addBook(form as Omit<Book, "id" | "createdAt">);
    router.push("/books");
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Adicionar um Novo Livro à Sua Estante
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Image Preview Column */}
              <div className="md:col-span-1 flex flex-col items-center">
                <Label className="mb-4 text-lg font-semibold text-gray-700 self-start">
                  Capa do Livro
                </Label>
                <div className="relative w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Preview da capa"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                      unoptimized
                    />
                  ) : (
                    <div className="text-gray-500 flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"
                        />
                      </svg>
                      <span className="text-center">Preview da Imagem</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields Column */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="title"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Título
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title || ""}
                    onChange={handleChange}
                    required
                    className="mt-2 p-3 text-base"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="author"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Autor
                  </Label>
                  <Input
                    id="author"
                    name="author"
                    value={form.author || ""}
                    onChange={handleChange}
                    required
                    className="mt-2 p-3 text-base"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="genre"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Gênero
                  </Label>
                  <Input
                    id="genre"
                    name="genre"
                    value={form.genre || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 text-base"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="status"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    className="w-full border rounded-lg p-3 mt-2 text-base"
                    value={form.status || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione o status</option>
                    <option value="to-read">Para Ler</option>
                    <option value="reading">Lendo</option>
                    <option value="finished">Finalizado</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="totalPages"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Total de Páginas
                  </Label>
                  <Input
                    type="number"
                    id="totalPages"
                    name="totalPages"
                    value={form.totalPages || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 text-base"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="currentPage"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Página Atual
                  </Label>
                  <Input
                    type="number"
                    id="currentPage"
                    name="currentPage"
                    value={form.currentPage || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 text-base"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="rating"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Avaliação (0 a 5)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    id="rating"
                    name="rating"
                    value={form.rating || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 text-base"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="isbn"
                    className="text-lg font-semibold text-gray-700"
                  >
                    ISBN
                  </Label>
                  <Input
                    id="isbn"
                    name="isbn"
                    value={form.isbn || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 text-base"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label
                    htmlFor="isbn"
                    className="text-lg font-semibold text-gray-700"
                  >
                    URL da Imagem.
                  </Label>
                  <Input
                    id="coverUrl"
                    name="coverUrl"
                    placeholder="Cole a URL da imagem da capa"
                    value={form.coverUrl || ""}
                    onChange={handleUrlChange}
                    className="mt-2 p-3 text-base"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="synopsis"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Sinopse
                  </Label>
                  <Textarea
                    id="synopsis"
                    name="synopsis"
                    value={form.synopsis || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 text-base"
                    rows={5}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-12">
              <Button type="submit" className="px-8 py-4 text-lg font-bold">
                Adicionar Livro
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
