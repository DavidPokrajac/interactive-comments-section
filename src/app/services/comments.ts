import { Injectable, signal } from '@angular/core';
import comments from '../../../data.json';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  comments = signal(comments.comments);
  willReply = signal([false, null]);

  replyTo(event: any) {
    this.willReply.set([true, event]);
  }

  isToDelete = signal<boolean>(false);
  commentId = signal<string | number>('');
  replyId = signal<string | number>('');
  isComment = signal<boolean>(false);
  datePublished = signal<any>(null);

  showDeleteModal(id: any, isComment: boolean, replyId?: any) {
    this.isToDelete.set(true);
    this.commentId.set(id as any);
    this.replyId.set(replyId as any);
    this.isComment.set(isComment);
  }

  closeModal() {
    this.isToDelete.set(false);
  }

  deleteComment(id: number | string) {
    this.comments.update((commentsList) => {
      const hey = commentsList.findIndex((v) => v.id === id);
      commentsList.splice(hey, 1);
      return commentsList;
    });
    this.closeModal();
  }

  deleteReply(commentId: number | string, id?: number | string) {
    this.comments.update((commentsList) => {
      const hey = commentsList.filter((v) => v.id === commentId);
      const reply = hey[0].replies.findIndex((r) => r.id === id);
      hey[0].replies.splice(reply, 1);
      return commentsList;
    });
    this.closeModal();
  }

  addComment(event: any, id?: number | string) {
    this.datePublished.set(event.commentDate);
    if (event.isReplying) {
      this.comments.update((commentsList) => {
        const findIndex = commentsList.findIndex((v) => v.id === id);
        commentsList[findIndex].replies.push(event);
        return commentsList;
      });
    } else {
      this.comments.set([...this.comments(), event]);
    }
  }

  increaseLikes(score: any) {
    if (score.hasOwnProperty('replyingTo')) {
      this.comments.update((value) => {
        const hi = value.filter((v) => v.replies.length !== 0);
        const hello = hi.filter((v) =>
          v.replies.find((c) => c.id === score.id)
        );
        const findIndex = hello[0].replies.findIndex((v) => v.id === score.id);
        hello[0].replies[findIndex].score += 1;
        return value;
      });
    } else {
      this.comments.update((value) => {
        const findIndex = value.findIndex((v) => v.id === score.id);
        value[findIndex].score += 1;
        return value;
      });
    }
  }

  decreaseLikes(score: any) {
    if (score.score === 0) {
      return;
    }
    if (score.hasOwnProperty('replyingTo')) {
      this.comments.update((value) => {
        const hi = value.filter((v) => v.replies.length !== 0);
        const hello = hi.filter((v) =>
          v.replies.find((c) => c.id === score.id)
        );
        const findIndex = hello[0].replies.findIndex((v) => v.id === score.id);
        hello[0].replies[findIndex].score -= 1;
        return value;
      });
    } else {
      this.comments.update((value) => {
        const findIndex = value.findIndex((v) => v.id === score.id);
        value[findIndex].score -= 1;
        return value;
      });
    }
  }
}
