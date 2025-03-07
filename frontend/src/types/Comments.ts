export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  score: number;
  userId: number;
  parentId: number | null;
  replyingTo: string | null;
}
