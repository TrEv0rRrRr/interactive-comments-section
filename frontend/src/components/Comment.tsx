import { useEffect, useState } from "react";
import DeleteIcon from "../assets/icon-delete.svg";
import EditIcon from "../assets/icon-edit.svg";
import ReplyIcon from "../assets/icon-reply.svg";
import { formatUserAt } from "../helpers/formatUserAt";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  getUserById,
} from "../services/api";
import { type Comment } from "../types/Comments";
import { User } from "../types/Users";
import Button from "./Button";
import Counter from "./Counter";

const Comment = () => {
  // CARGAR DATOS
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});

  // EDIT MODE STATES
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  // REPLY MODE STATES
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const currentUser = "juliusomo";

  useEffect(() => {
    getComments().then(setComments);
  }, []);

  useEffect(() => {
    const userIds = [...new Set(comments.map((comment) => comment.userId))];
    userIds.forEach((userId) => {
      if (!users[userId]) {
        getUserById(userId).then((userData) => {
          setUsers((prevUsers) => ({
            ...prevUsers,
            [userId]: userData,
          }));
        });
      }
    });
  }, [comments, users]);

  const handleDelete = async (id: number) => {
    try {
      await deleteComment(id);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (id: number, currentContent: string) => {
    setEditingCommentId(id);
    setEditedContent(currentContent);
  };

  const handleEdit = async (
    id: number,
    score: number,
    replyingUsername: string | null,
    parentId: number | null
  ) => {
    try {
      const updatedComment = await editComment(id, {
        content: editedContent,
        score,
        parentId,
        replyingTo: replyingUsername,
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? updatedComment : comment
        )
      );
      setEditingCommentId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const startReplying = (id: number) => {
    setReplyingToId(id);
    setReplyContent("");
  };

  const handleReply = async (parentId: number, replyingToUsername: string) => {
    if (replyContent.trim() === "") return;

    try {
      // Obtener el ID del usuario actual (juliusomo)
      // * const currentUserId = 4; Deberías tener este valor almacenado o recuperarlo

      const reply = await createComment(replyContent, {
        parentId: parentId,
        replyingTo: replyingToUsername, // Si tu API lo requiere
      });

      // Lógica para insertar la respuesta en la posición correcta
      const newComments = [...comments];

      // Buscar el índice del comentario padre
      const parentIndex = newComments.findIndex(
        (comment) => comment.id === parentId
      );

      if (parentIndex !== -1) {
        // Encontrar la última respuesta relacionada con este comentario padre
        let lastReplyIndex = parentIndex;
        for (let i = parentIndex + 1; i < newComments.length; i++) {
          if (newComments[i].parentId === parentId) {
            lastReplyIndex = i;
          } else {
            // Si encontramos un comentario que no es respuesta al padre o
            // es respuesta a otro comentario, nos detenemos
            const nextIsChild = newComments[i].parentId !== null;
            const nextIsNotChildOfCurrent =
              nextIsChild && newComments[i].parentId !== parentId;

            if (!nextIsChild || nextIsNotChildOfCurrent) {
              break;
            }
          }
        }

        // Insertar la nueva respuesta justo después de la última respuesta
        newComments.splice(lastReplyIndex + 1, 0, reply);
        setComments(newComments);
      } else {
        // Si por alguna razón no encontramos el padre, agregamos al final
        setComments((prevComments) => [...prevComments, reply]);
      }

      setReplyingToId(null);
      setReplyContent("");
    } catch (error) {
      console.error(error);
    }
  };

  // Organizar comentarios por parentId
  const commentsByParentId: Record<string, Comment[]> = {};
  comments.forEach((comment) => {
    const parentId = comment.parentId ? String(comment.parentId) : "root";
    if (!commentsByParentId[parentId]) {
      commentsByParentId[parentId] = [];
    }
    commentsByParentId[parentId].push(comment);
  });

  // Función recursiva para renderizar comentarios con sus respuestas
  const renderCommentWithReplies = (comment: Comment) => {
    const { content, score, id, userId, createdAt, replyingTo, parentId } =
      comment;
    const isCurrentUser = users[userId]?.username === currentUser;
    const isEditing = editingCommentId === id;
    const isReplying = replyingToId === id;
    const username = users[userId]?.username || "";

    return (
      <div key={id} className="flex flex-col gap-3 mb-4">
        {/* Comentario actual */}
        <div
          className={`flex w-full flex-col gap-3 p-3 rounded-xl bg-White relative group ${
            replyingTo
              ? "after:content-[''] after:absolute after:w-[2px] after:h-full after:bg-Moderate-blue/30 after:left-[-20px] after:top-0"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-3 items-center">
              <img
                src={users[userId]?.avatar}
                alt={`${users[userId]?.username}'s profile picture`}
                className="w-8 h-8 object-contain"
              />
              <div className="flex gap-3">
                <span className="font-medium">{users[userId]?.username}</span>
                {isCurrentUser && (
                  <span className="bg-Moderate-blue text-white p-1 rounded text-xs">
                    you
                  </span>
                )}
              </div>
            </div>
            <span className="text-Grayish-Blue">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          {isCurrentUser && isEditing ? (
            <textarea
              className="border-[1px] border-Grayish-Blue/30 rounded px-5 pb-5 hover:border-Moderate-blue transition-all focus:outline-Moderate-blue active:outline-Moderate-blue pt-4 h-max resize-none"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <p className="text-Grayish-Blue">
              <span className="text-Moderate-blue font-medium">
                {formatUserAt(replyingTo)}
              </span>{" "}
              {content}
            </p>
          )}

          <div className="flex items-center justify-between w-full">
            <Counter count={score} />
            {isEditing && isCurrentUser ? (
              <div>
                <button
                  className="bg-Moderate-blue text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-Moderate-blue/40 transition-all"
                  onClick={() => handleEdit(id, score, replyingTo, parentId)}
                >
                  UPDATE
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                {!isEditing && isCurrentUser ? (
                  <>
                    <div className="hidden group-hover:flex gap-3">
                      <Button
                        color="text-Soft-Red"
                        source={DeleteIcon}
                        text="Delete"
                        handleClick={() => handleDelete(id)}
                      />
                      <Button
                        source={EditIcon}
                        text="Edit"
                        handleClick={() => startEditing(id, content)}
                      />
                    </div>
                    <div className="block group-hover:hidden">
                      <Button
                        source={ReplyIcon}
                        text="Reply"
                        handleClick={() => startReplying(id)}
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <Button
                      source={ReplyIcon}
                      text="Reply"
                      handleClick={() => startReplying(id)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Formulario de respuesta */}
        {isReplying && (
          <div className="flex flex-col bg-White p-5 gap-5 w-full mt-2 rounded-xl">
            <textarea
              placeholder={`Reply to @${username}...`}
              className="border-[1px] border-Grayish-Blue/30 rounded 
              px-5 h-24 py-2 resize-none placeholder:text-Grayish-Blue hover:border-Moderate-blue focus:outline-Moderate-blue active:outline-Moderate-blue transition-all"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />

            <div className="flex justify-between items-center">
              <img
                src="avatars/image-juliusomo.webp"
                alt="Your profile picture"
                className="w-8 h-8 object-contain"
              />
              <button
                className="bg-Moderate-blue text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-Moderate-blue/40 transition-all"
                onClick={() => handleReply(id, username)}
              >
                REPLY
              </button>
            </div>
          </div>
        )}

        {/* Respuestas a este comentario */}
        {commentsByParentId[String(id)] && (
          <div className="ml-5 pl-5 border-l-2 border-Moderate-blue/30 flex flex-col gap-3">
            {commentsByParentId[String(id)].map((reply) =>
              renderCommentWithReplies(reply)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col p-1 gap-5">
      {/* Renderizar solo comentarios raíz (sin parentId) */}
      {commentsByParentId["root"]?.map((comment) =>
        renderCommentWithReplies(comment)
      )}
    </div>
  );
};

export default Comment;
