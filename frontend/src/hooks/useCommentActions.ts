// src/hooks/useCommentActions.ts
import { useState } from "react";

export const useCommentActions = () => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const startEditing = (id: number, content: string) => {
    setEditingCommentId(id);
    setEditedContent(content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const startReplying = (id: number) => {
    setReplyingToId(id);
    setReplyContent("");
  };

  const cancelReplying = () => {
    setReplyingToId(null);
    setReplyContent("");
  };

  return {
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
  };
};
