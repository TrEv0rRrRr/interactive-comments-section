import { useState } from "react";
import DeleteIcon from "../assets/icon-delete.svg";
import EditIcon from "../assets/icon-edit.svg";
import ReplyIcon from "../assets/icon-reply.svg";
import { formatUserAt } from "../helpers/formatUserAt";
import { useCommentActions } from "../hooks/useCommentActions";
import { useComments } from "../hooks/useComments";
import useModal from "../hooks/useModal";
import { useUsers } from "../hooks/useUsers";
import { type Comment as CommentType } from "../types/Comments";
import Button from "./Button";
import Counter from "./Counter";
import Modal from "./Modal";

const Comment = () => {
  const { comments, addReply, updateComment, getCommentsByParentId } =
    useComments();

  const {
    editingCommentId,
    editedContent,
    setEditedContent,
    replyingToId,
    replyContent,
    setReplyContent,
    startEditing,
    cancelEditing,
    startReplying,
    cancelReplying,
  } = useCommentActions();

  const { openModal } = useModal();

  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // Get all user IDs from comments
  const userIds = comments.map((comment) => comment.userId);
  const { users } = useUsers(userIds);

  const currentUser = "juliusomo";
  const commentsByParentId = getCommentsByParentId();

  const handleEdit = async (
    id: number,
    score: number,
    replyingTo?: string | null,
    parentId?: number | null
  ) => {
    const success = await updateComment(id, {
      content: editedContent,
      score,
      replyingTo,
      parentId,
    });

    if (success) cancelEditing();
  };

  const handleDelete = (id: number) => {
    setIdToDelete(id);
    openModal();
  };

  const handleReply = async (parentId: number, replyingToUsername: string) => {
    if (replyContent.trim() === "") return;

    const success = await addReply(replyContent, parentId, replyingToUsername);

    if (success) cancelReplying();
  };

  const renderCommentWithReplies = (comment: CommentType) => {
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
              <div className="flex gap-3">
                <button
                  className="border border-Moderate-blue text-Moderate-blue font-medium rounded px-5 py-2 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={cancelEditing}
                >
                  CANCEL
                </button>
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
                    <div className="flex gap-3">
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
              <div className="flex gap-3">
                <button
                  className="border border-Moderate-blue text-Moderate-blue font-medium rounded px-5 py-2 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={cancelReplying}
                >
                  CANCEL
                </button>
                <button
                  className="bg-Moderate-blue text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-Moderate-blue/40 transition-all"
                  onClick={() => handleReply(id, username)}
                >
                  REPLY
                </button>
              </div>
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
    <div className="flex flex-col p-1 gap-5 relative">
      {/* Renderizar solo comentarios raíz (sin parentId) */}
      {commentsByParentId["root"]?.map((comment) =>
        renderCommentWithReplies(comment)
      )}
      <Modal id={idToDelete} />
    </div>
  );
};

export default Comment;
