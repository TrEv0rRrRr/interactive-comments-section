import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando la base de datos...");
  await prisma.comment.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Base de datos limpiada con éxito");

  // Leer el archivo JSON
  const data = JSON.parse(fs.readFileSync("src/data.json", "utf-8"));

  // Insertar el usuario actual (currentUser)
  const currentUser = await prisma.user.create({
    data: {
      username: data.currentUser.username,
      avatar: data.currentUser.image.webp,
    },
  });

  // Función para insertar comentarios recursivamente
  async function insertComment(comment, parentId = null) {
    // Verificar si el usuario ya existe
    let user = await prisma.user.findUnique({
      where: { username: comment.user.username },
    });

    // Si no existe, crearlo
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: comment.user.username,
          avatar: comment.user.image.webp,
        },
      });
    }

    // Insertar el comentario
    const newComment = await prisma.comment.create({
      data: {
        content: comment.content,
        createdAt: new Date(),
        score: comment.score,
        userId: user.id,
        parentId: parentId,
        replyingTo: comment.replyingTo || null,
      },
    });

    // Insertar respuestas si tiene
    if (comment.replies && comment.replies.length > 0) {
      await Promise.all(
        comment.replies.map((reply) => insertComment(reply, newComment.id))
      );
    }
  }

  // Insertar los comentarios principales
  await Promise.all(data.comments.map((comment) => insertComment(comment)));

  console.log(data);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
