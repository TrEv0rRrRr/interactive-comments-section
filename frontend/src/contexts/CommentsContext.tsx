import { createContext } from "react";

import { Comment } from "../types/Comments";

type CommentsContextType = {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (content: string) => Promise<boolean>;
  addReply: (
    content: string,
    parentId: number,
    replyingToUsername: string
  ) => Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateComment: (id: number, updates: any) => Promise<boolean>;
  removeComment: (id: number) => Promise<boolean>;
  getCommentsByParentId: () => Record<string, Comment[]>;
};

export const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined
);
