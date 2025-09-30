"use client";

import Image from "next/image";
import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Livro = {
  id: number;
  titulo: string;
  autor: string;
  genero?: string;
  ano?: number;
  paginas?: number;
  avaliacao?: number;
  capa?: string;
  status: "lendo" | "finalizado" | "pendente";
  sinopse?: string;
};

export default function AdicionarLivro() {
  const [form, setForm] = useState<Partial<Livro>>({});
  const [livros, setLivros] = useState<Livro[]>([]);
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

  const camposTotais = 7;
  const preenchidos = Object.values(form).filter((v) => v && v !== "").length;
  const progresso = Math.round((preenchidos / camposTotais) * 100);

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
    const novoLivro: Livro = {
      id: Date.now(),
      titulo: form.titulo || "",
      autor: form.autor || "",
      genero: form.genero,
      ano: form.ano ? Number(form.ano) : undefined,
      paginas: form.paginas ? Number(form.paginas) : undefined,
      capa: form.capa,
      status: (form.status as Livro["status"]) || "pendente",
      sinopse: form.sinopse,
    };
    setLivros([...livros, novoLivro]);
    setForm({});
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Livro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Título */}
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                name="titulo"
                value={form.titulo || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Autor */}
            <div>
              <Label htmlFor="autor">Autor</Label>
              <Input
                id="autor"
                name="autor"
                value={form.autor || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gênero */}
            <div>
              <Label htmlFor="genero">Gênero</Label>
              <Input
                id="genero"
                name="genero"
                value={form.genero || ""}
                onChange={handleChange}
              />
            </div>

            {/* Ano */}
            <div>
              <Label htmlFor="ano">Ano de Publicação</Label>
              <Input
                type="number"
                id="ano"
                name="ano"
                value={form.ano || ""}
                onChange={handleChange}
              />
            </div>

            {/* Páginas */}
            <div>
              <Label htmlFor="paginas">Número de Páginas</Label>
              <Input
                type="number"
                id="paginas"
                name="paginas"
                value={form.paginas || ""}
                onChange={handleChange}
              />
            </div>

            {/* Avaliação */}
            <div>
              <Label htmlFor="avaliacao">Avaliação (0 a 5)</Label>
              <Input
                type="number"
                min="0"
                max="5"
                id="avaliacao"
                name="avaliacao"
                value={form.avaliacao || ""}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="w-full border rounded p-2"
                value={form.status || ""}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="pendente">Pendente</option>
                <option value="lendo">Lendo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>

            {/* Capa */}
            <div>
              <Label htmlFor="capa">URL da Capa</Label>
              <Input
                id="capa"
                name="capa"
                value={form.capa || ""}
                onChange={handleUrlChange}
              />
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Preview da capa"
                  width={160}
                  height={240}
                  className="object-cover rounded shadow"
                  unoptimized
                />
              )}
            </div>

            {/* Sinopse */}
            <div>
              <Label htmlFor="sinopse">Sinopse</Label>
              <Textarea
                id="sinopse"
                name="sinopse"
                value={form.sinopse || ""}
                onChange={handleChange}
              />
            </div>

            {/* Barra de Progresso */}
            <div>
              <Label>Progresso do Preenchimento</Label>
              <Progress value={progresso} className="mt-1" />
              <p className="text-sm text-muted-foreground mt-1">
                {progresso}% completo
              </p>
            </div>

            <Button type="submit">Adicionar Livro</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de livros adicionados */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Livros Adicionados</h2>
        <ul className="space-y-2">
          {livros.map((livro) => (
            <li key={livro.id} className="p-2 border rounded">
              <strong>{livro.titulo}</strong> — {livro.autor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
