const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const genres = [
  {
    title: "Literatura Brasileira",
    description: "Obras da literatura brasileira",
  },
  {
    title: "Ficção Científica",
    description: "Histórias baseadas em ciência e tecnologia futurista",
  },
  {
    title: "Realismo Mágico",
    description: "Narrativas que mesclam realidade e elementos mágicos",
  },
  { title: "Ficção", description: "Histórias imaginativas e criativas" },
  { title: "Fantasia", description: "Mundos imaginários e elementos mágicos" },
  {
    title: "Romance",
    description: "Histórias focadas em relacionamentos e amor",
  },
  { title: "Biografia", description: "Relatos da vida de pessoas reais" },
  { title: "História", description: "Eventos e períodos históricos" },
  { title: "Autoajuda", description: "Livros para desenvolvimento pessoal" },
  { title: "Tecnologia", description: "Temas relacionados à tecnologia" },
  {
    title: "Programação",
    description: "Livros sobre desenvolvimento de software",
  },
  {
    title: "Negócios",
    description: "Temas relacionados a empreendedorismo e gestão",
  },
  {
    title: "Psicologia",
    description: "Estudos sobre comportamento e mente humana",
  },
  { title: "Filosofia", description: "Pensamento e reflexão filosófica" },
  { title: "Poesia", description: "Obras poéticas e versos" },
  { title: "Mistério", description: "Histórias de suspense e investigação" },
  { title: "Terror", description: "Histórias de horror e medo" },
  { title: "Drama", description: "Narrativas emocionais e conflitos humanos" },
  { title: "Aventura", description: "Histórias de jornadas e descobertas" },
  { title: "Infantil", description: "Literatura para crianças" },
  { title: "Juvenil", description: "Literatura para adolescentes" },
  {
    title: "Graphic Novel",
    description: "Histórias em quadrinhos e romances gráficos",
  },
  { title: "Mangá", description: "Quadrinhos japoneses" },
  { title: "HQ", description: "Histórias em quadrinhos" },
  { title: "Ciência", description: "Temas científicos diversos" },
  { title: "Medicina", description: "Temas relacionados à saúde e medicina" },
  { title: "Política", description: "Temas políticos e sociais" },
  { title: "Economia", description: "Temas econômicos e financeiros" },
  {
    title: "Educação",
    description: "Temas relacionados ao ensino e aprendizagem",
  },
  { title: "Culinária", description: "Livros de receitas e gastronomia" },
];

async function main() {
  console.log("Iniciando seed...");

  for (const genre of genres) {
    const existingGenre = await prisma.genre.findFirst({
      where: { title: genre.title },
    });

    if (!existingGenre) {
      await prisma.genre.create({
        data: genre,
      });
      console.log(`Gênero criado: ${genre.title}`);
    } else {
      console.log(`Gênero já existe: ${genre.title}`);
    }
  }

  console.log("Seed finalizado!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
