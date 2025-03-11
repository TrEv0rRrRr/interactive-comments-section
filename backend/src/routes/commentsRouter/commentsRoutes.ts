import type { Request, Response } from "express"; 
import { Router } from "express";
import prisma from "../../lib/prisma.js";
const router = Router();

type ParentId = number | null;

router.get("/", async (req: Request, res: Response) => {
  const comments = await prisma.comment.findMany();

  res.json(comments);
});

router.post("/", async (req: Request, res: Response) => {
  const { content, score, userId, replyingTo, parentId } = req.body;

  try {
    if (!content || content === "") {
      res.status(400).json({ error: "El contenido es requerido" });
      return;
    }

    if (score === undefined || isNaN(Number(score))) {
      res.status(400).json({ error: "Score inválido" });
      return;
    }

    if (!userId || isNaN(Number(userId))) {
      res.status(400).json({ error: "ID de usuario inválido" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      res.status(404).json({ error: "No se encontró al usuario que comenta" });
      return;
    }

    if (replyingTo && replyingTo !== "") {
      const replyToUser = await prisma.user.findUnique({
        where: { username: replyingTo },
      });

      if (!replyToUser) {
        res
          .status(404)
          .json({ error: "No se encontró al usuario al que se responde" });
        return;
      }
    }

    let updatedParentId: ParentId;

    if (parentId !== undefined && parentId !== null) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: Number(parentId) },
      });

      if (!parentComment) {
        res.status(404).json({
          error: "El comentario al que querías responder no existe.",
        });
        return;
      }

      updatedParentId = parentComment.id;
    } else {
      updatedParentId = null;
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        score: Number(score),
        userId: user.id,
        replyingTo: replyingTo || null,
        parentId: updatedParentId,
      },
    });

    res.json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el comentario" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, score, replyingTo, parentId } = req.body;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      res.status(404).json({ error: "No se encontró el comentario" });
      return;
    }

    if (!content || content === "") {
      res.status(400).json({ error: "El contenido es requerido" });
      return;
    }

    if (score === undefined || isNaN(Number(score))) {
      res.status(400).json({ error: "Score inválido" });
      return;
    }

    if (replyingTo && replyingTo !== "") {
      const replyToUser = await prisma.user.findUnique({
        where: { username: replyingTo },
      });

      if (!replyToUser) {
        res
          .status(404)
          .json({ error: "No se encontró al usuario al que se responde" });
        return;
      }

      const commentCreator = await prisma.user.findUnique({
        where: { id: comment.userId },
      });

      if (replyToUser.username === commentCreator?.username) {
        res.status(400).json({
          error:
            "El usuario que creó el comentario y al que quiere responder son los mismos.",
        });
        return;
      }
    }

    let updatedParentId = comment.parentId;

    if (parentId !== undefined && parentId !== null) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: Number(parentId) },
      });

      if (!parentComment) {
        res.status(404).json({
          error: "El comentario al que querías responder no existe.",
        });
        return;
      }

      updatedParentId = parentComment.id;
    } else {
      updatedParentId = null;
    }

    const commentUpdated = await prisma.comment.update({
      where: { id: Number(id) },
      data: {
        content,
        score: Number(score),
        parentId: updatedParentId,
        replyingTo: replyingTo || null,
      },
    });

    res.json(commentUpdated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar el comentario" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      res.status(404).json({ error: "No se encontró el comentario" });
      return;
    }

    await prisma.comment.delete({
      where: { id: Number(id) },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al borrar el comentario" });
  }
});

export { router as commentsRouter };
