"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface BookSearchProps {
  onSubmit: (input: string) => void;
  isLoading?: boolean;
}
export default function BookSearch({ onSubmit, isLoading }: BookSearchProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(input);
  };

  const handleClearFilter = () => {
    setInput("");
    onSubmit("");
  };

  return (
    <form onSubmit={handleSubmit} className="gap-2">
      <div className="flex lg:justify-start items-center gap-2">
        <Input
          className="w-60"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="submit" className="bg-blue-600 border border-none">
          {isLoading ? "..." : "Buscar"}
        </Button>

        {input && (
          <Button
            type="button"
            onClick={handleClearFilter}
            className="bg-gray-400 text-white"
          >
            Limpar
          </Button>
        )}
      </div>
    </form>
  );
}
