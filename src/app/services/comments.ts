import { Injectable, signal } from '@angular/core';
import comments from '../../../data.json';
import { CommentModel } from '../models/comment-model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  comments = signal(comments.comments);
  willReply = signal<[boolean, number | string | null]>([false, null]);
  isToDelete = signal<boolean>(false);
  commentId = signal<string | number>('');
  replyId = signal<string | number>('');
  isComment = signal<boolean>(false);
  datePublished = signal<string>('');

  replyTo(eventID: number | string) {
    this.willReply.set([true, eventID]);
  }

  showDeleteModal(
    id: number | string,
    isComment: boolean,
    replyId?: number | string
  ) {
    this.isToDelete.set(true);
    this.commentId.set(id);
    this.replyId.set(replyId as number | string);
    this.isComment.set(isComment);
  }

  closeModal() {
    this.isToDelete.set(false);
  }

  deleteComment(id: number | string) {
    this.comments.update((commentsList) => {
      const commentIndex = commentsList.findIndex(
        (comment) => comment.id === id
      );
      commentsList.splice(commentIndex, 1);
      return commentsList;
    });
    this.closeModal();
  }

  deleteReply(commentId: number | string, id?: number | string) {
    this.comments.update((commentsList) => {
      const commentWithReplyID = commentsList.filter(
        (comment) => comment.id === commentId
      );
      const reply = commentWithReplyID[0].replies.findIndex(
        (reply) => reply.id === id
      );
      commentWithReplyID[0].replies.splice(reply, 1);
      return commentsList;
    });
    this.closeModal();
  }

  addComment(comment: any, id?: number | string) {
    this.datePublished.set(comment.commentDate);
    if (comment.isReplying) {
      this.comments.update((commentsList) => {
        if (
          commentsList.find((comment) =>
            comment.replies.some((reply) => reply.id === id)
          )
        ) {
          const replyWithID = commentsList.find((comment) =>
            comment.replies.some((reply) => reply.id === id)
          );
          const replyIndex = replyWithID!.replies.findIndex(
            (reply) => reply.id === id
          );

          replyWithID!.replies.push(comment);
          replyWithID!.replies[replyWithID!.replies.length - 1].replyingTo =
            replyWithID!.replies[replyIndex].user.username;
          comment.replyingTo = replyWithID!.replies[replyIndex].user.username;
          return commentsList;
        } else {
          const commentIndex = commentsList.findIndex(
            (comment) => comment.id === id
          );
          comment.replyingTo = commentsList[commentIndex].user.username;
          commentsList[commentIndex].replies.push(comment);
          return commentsList;
        }
      });
    } else {
      this.comments.set([...this.comments(), comment]);
    }
  }

  increaseLikes(comment: CommentModel) {
    if (comment.hasOwnProperty('replyingTo')) {
      this.comments.update((comments) => {
        const commentsWithReplies = comments.filter(
          (comment) => comment.replies.length !== 0
        );
        const commentsWithReplyID = commentsWithReplies.filter(
          (commentWithReply) =>
            commentWithReply.replies.find((reply) => reply.id === comment.id)
        );
        const replyIndex = commentsWithReplyID[0].replies.findIndex(
          (reply) => reply.id === comment.id
        );
        commentsWithReplyID[0].replies[replyIndex].score += 1;
        return comments;
      });
    } else {
      this.comments.update((comments) => {
        const commentIndex = comments.findIndex(
          (comm) => comm.id === comment.id
        );
        comments[commentIndex].score += 1;
        return comments;
      });
    }
  }

  decreaseLikes(comment: CommentModel) {
    if (comment.score === 0) {
      return;
    }
    if (comment.hasOwnProperty('replyingTo')) {
      this.comments.update((comments) => {
        const commentsWithReplies = comments.filter(
          (comment) => comment.replies.length !== 0
        );
        const commentWithReplyID = commentsWithReplies.filter(
          (commentWithReply) =>
            commentWithReply.replies.find((reply) => reply.id === comment.id)
        );
        const replyIndex = commentWithReplyID[0].replies.findIndex(
          (reply) => reply.id === comment.id
        );
        commentWithReplyID[0].replies[replyIndex].score -= 1;
        return comments;
      });
    } else {
      this.comments.update((comments) => {
        const commentIndex = comments.findIndex(
          (comm) => comm.id === comment.id
        );
        comments[commentIndex].score -= 1;
        return comments;
      });
    }
  }
}
