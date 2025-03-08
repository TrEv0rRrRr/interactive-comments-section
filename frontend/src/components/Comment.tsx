import { useEffect, useState } from "react";
import DeleteIcon from "../assets/icon-delete.svg";
import EditIcon from "../assets/icon-edit.svg";
import ReplyIcon from "../assets/icon-reply.svg";
import { formatUserAt } from "../helpers/formatUserAt";
import {
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
  const [editedContent, setEditedContent] = useState<string>("");

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

  const handleEdit = async (id: number) => {
    try {
      const updatedComment = await editComment(id, {
        content: editedContent,
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

  return (
    <div className="flex flex-col p-1 gap-5">
      {comments.map(({ content, score, id, userId, createdAt, replyingTo }) => {
        const isCurrentUser = users[userId]?.username === currentUser;
        const isEditing = editingCommentId === id;

        return (
          <div
            key={id}
            className={`flex w-full flex-col gap-3 p-3  rounded-xl bg-White relative group ${
              replyingTo
                ? "mx-5 after:content-[''] after:absolute after:w-[2px] after:h-full after:bg-Moderate-blue/30 after:left-[-20px] after:top-0"
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
                className={`text-Grayish-Blue
                  ${
                    isCurrentUser && isEditing
                      ? "border-[1px] border-Grayish-Blue/30 rounded px-5 pb-5 hover:border-Moderate-blue transition-all focus:outline-Moderate-blue active:outline-Moderate-blue pt-4 h-max"
                      : "p-0 transition-all"
                  }`}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            ) : (
              <p>
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
                    onClick={() => handleEdit(id)}
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
                        <Button source={ReplyIcon} text="Reply" />
                      </div>
                    </>
                  ) : (
                    <div>
                      <Button source={ReplyIcon} text="Reply" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Comment;
