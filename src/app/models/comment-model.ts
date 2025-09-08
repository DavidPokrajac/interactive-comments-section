export interface CommentModel {
  user: {
    username: string;
    image: {
      webp: string;
    };
  };
  content: string;
  score: number;
  isReplying: unknown;
  id: string | number;
  createdAt: string;
  replyingTo?: string;
}
