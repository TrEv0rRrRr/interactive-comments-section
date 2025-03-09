import { useContext } from "react";
import { CommentsContext } from "../contexts/CommentsContext";

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentsProvider");
  }
  return context;
};
