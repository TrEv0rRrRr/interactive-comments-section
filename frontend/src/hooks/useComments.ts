import { useEffect, useState } from "react";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
} from "../services/api";
import { Comment } from "../types/Comments";

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getComments();
        setComments(data);
      } catch (err) {
        setError("Failed to fetch comments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const addReply = async (
    content: string,
    parentId: number,
    replyingToUsername: string
  ) => {
    try {
      const reply = await createComment(content, {
        parentId,
        replyingTo: replyingToUsername,
      });

      // Insert reply at correct position
      const newComments = [...comments];
      const parentIndex = newComments.findIndex(
        (comment) => comment.id === parentId
      );

      if (parentIndex !== -1) {
        // Find last reply to this parent
        let lastReplyIndex = parentIndex;
        for (let i = parentIndex + 1; i < newComments.length; i++) {
          if (newComments[i].parentId === parentId) {
            lastReplyIndex = i;
          } else {
            const nextIsChild = newComments[i].parentId !== null;
            const nextIsNotChildOfCurrent =
              nextIsChild && newComments[i].parentId !== parentId;

            if (!nextIsChild || nextIsNotChildOfCurrent) {
              break;
            }
          }
        }

        newComments.splice(lastReplyIndex + 1, 0, reply);
        setComments(newComments);
      } else {
        setComments((prev) => [...prev, reply]);
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateComment = async (
    id: number,
    updates: {
      content: string;
      score: number;
      replyingTo?: string | null;
      parentId?: number | null;
    }
  ) => {
    try {
      const updated = await editComment(id, updates);
      setComments((prev) =>
        prev.map((comment) => (comment.id === id ? updated : comment))
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const removeComment = async (id: number) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Group comments by parentId for hierarchical display
  const getCommentsByParentId = () => {
    const commentsByParentId: Record<string, Comment[]> = {};
    comments.forEach((comment) => {
      const parentId = comment.parentId ? String(comment.parentId) : "root";
      if (!commentsByParentId[parentId]) {
        commentsByParentId[parentId] = [];
      }
      commentsByParentId[parentId].push(comment);
    });
    return commentsByParentId;
  };

  return {
    comments,
    loading,
    error,
    addReply,
    updateComment,
    removeComment,
    getCommentsByParentId,
  };
};
