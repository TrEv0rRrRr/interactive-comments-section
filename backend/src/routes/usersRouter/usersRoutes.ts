import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    res.status(404).json({ error: "No se encontró al usuario." });
    return;
  }

  res.json(user);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, avatar } = req.body;

    if (!username) {
      res.status(400).json({ error: "El username es necesario" });
      return;
    }

    const newAvatar = avatar ?? "./images/avatars/image-default.webp";

    const newUser = await prisma.user.create({
      data: {
        username,
        avatar: newAvatar,
      },
    });

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, avatar } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      res.status(404).json({ error: "No se encontró el usuario" });
      return;
    }

    if (!username || username === "") {
      res.status(400).json({ error: "El username es requerido" });
      return;
    }

    const newAvatar = avatar ?? "./images/avatars/image-default.webp";

    const userUpdated = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username,
        avatar: newAvatar,
      },
    });

    res.json(userUpdated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar el usuario" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      res.status(404).json({ error: "No se encontró el usuario" });
      return;
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al borrar el usuario" });
  }
});

export { router as usersRouter };
