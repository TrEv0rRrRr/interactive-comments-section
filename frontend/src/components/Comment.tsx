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
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(
    null
  );
  const [editedContent, setEditedContent] = useState<string>("");
  const [replyContent, setReplyContent] = useState<string>("");
  const currentUser = "juliusomo";
  const currentUserId = 41;

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
    replyingTo?: string | null
  ) => {
    try {
      const updatedComment = await editComment(id, {
        content: editedContent,
        score,
        replyingTo,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startReplying = (id: number, _username: string) => {
    setReplyingToCommentId(id);
    setReplyContent("");
  };

  const handleReply = async (parentId: number, replyingToUsername: string) => {
    if (replyContent.trim() === "") return;

    try {
      const newComment = await createComment(replyContent, {
        userId: currentUserId,
        parentId,
        replyingTo: replyingToUsername,
      });

      // Importante: Insertar la nueva respuesta justo después del comentario padre
      const newComments = [...comments];

      // Encontrar el índice del comentario padre
      const parentIndex = newComments.findIndex(
        (comment) => comment.id === parentId
      );

      if (parentIndex !== -1) {
        // Encontrar el último índice de las respuestas actuales del padre
        let lastReplyIndex = parentIndex;
        for (let i = parentIndex + 1; i < newComments.length; i++) {
          if (newComments[i].parentId === parentId) {
            lastReplyIndex = i;
          } else if (
            !newComments[i].parentId ||
            newComments[i].parentId !== parentId
          ) {
            break;
          }
        }

        // Insertar la nueva respuesta justo después de la última respuesta
        newComments.splice(lastReplyIndex + 1, 0, newComment);
        setComments(newComments);
      } else {
        // Si no encontramos el padre (raro pero posible), añadir al final
        setComments([...comments, newComment]);
      }

      setReplyingToCommentId(null);
      setReplyContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const commentsByParentId: Record<string, Comment[]> = {};

  // Agrupar comentarios por su parentId
  comments.forEach((comment) => {
    const parentId = comment.parentId ? String(comment.parentId) : "root";
    if (!commentsByParentId[parentId]) {
      commentsByParentId[parentId] = [];
    }
    commentsByParentId[parentId].push(comment);
  });

  // Renderizar un comentario y sus respuestas recursivamente
  const renderCommentWithReplies = (comment: Comment, level = 0) => {
    const { content, score, id, userId, createdAt, replyingTo } = comment;
    const isCurrentUser = users[userId]?.username === currentUser;
    const isEditing = editingCommentId === id;
    const isReplying = replyingToCommentId === id;
    const username = users[userId]?.username || "";

    const textAreaStyles =
      isCurrentUser && isEditing
        ? "border-[1px] border-Grayish-Blue/30 rounded px-5 pb-5 hover:border-Moderate-blue transition-all w-full focus:outline-Moderate-blue active:outline-Moderate-blue pt-4 h-max"
        : "p-0 transition-all";

    return (
      <div key={id} className="flex flex-col gap-3">
        <div
          className={`flex w-full flex-col gap-3 p-3 rounded-xl bg-White relative group ${
            replyingTo
              ? `ml-${
                  level * 5
                } after:content-[''] after:absolute after:w-[2px] after:h-full after:bg-Moderate-blue/30 after:left-[-20px] after:top-0`
              : ""
          }`}
        >
          {/* Contenido del comentario */}
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

          {/* Contenido editable o no */}
          {isCurrentUser && isEditing ? (
            <div className="relative">
              {replyingTo && (
                <span className="absolute top-4 left-5 text-Moderate-blue font-medium">
                  {formatUserAt(replyingTo)}
                </span>
              )}
              <textarea
                className={`text-Grayish-Blue resize-none ${textAreaStyles}`}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={
                  replyingTo
                    ? {
                        paddingLeft: `${
                          replyingTo !== undefined &&
                          (formatUserAt(replyingTo)?.length ?? 0) * 11 + 10
                        }px`,
                      }
                    : {}
                }
              />
            </div>
          ) : (
            <p className="text-Grayish-Blue">
              <span className="text-Moderate-blue font-medium">
                {formatUserAt(replyingTo)}
              </span>{" "}
              {content}
            </p>
          )}

          {/* Contador y botones */}
          <div className="flex items-center justify-between w-full">
            <Counter count={score} />
            {isEditing && isCurrentUser ? (
              <div>
                <button
                  className="bg-Moderate-blue text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-Moderate-blue/40 transition-all"
                  onClick={() => handleEdit(id, score, replyingTo)}
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
                        handleClick={() => startReplying(id, username)}
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <Button
                      source={ReplyIcon}
                      text="Reply"
                      handleClick={() => startReplying(id, username)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Formulario de respuesta */}
        {isReplying && (
          <div className="flex flex-col bg-White p-5 gap-5 w-full mt-3 rounded-xl">
            <textarea
              placeholder={`Replying to @${username}...`}
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

        {/* Renderizar respuestas anidadas con indentación */}
        {commentsByParentId[String(id)]?.map((reply) =>
          renderCommentWithReplies(reply, level + 1)
        )}
      </div>
    );
  };

  // Renderizar comentarios raíz (sin padre)
  return (
    <div className="flex flex-col p-1 gap-5">
      {commentsByParentId["root"]?.map((comment) =>
        renderCommentWithReplies(comment)
      )}
    </div>
  );
};

export default Comment;
