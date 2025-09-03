import {
  Component,
  input,
  signal,
  inject,
  output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommentInput } from '../comment-input/comment-input';
import { CommentsService } from '../../services/comments';
import currentUser from '../../../../data.json';

@Component({
  selector: 'app-comments',
  imports: [CommentInput],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
  standalone: true,
})
export class Comments {
  commentsList = input<any>([]);

  comments = inject(CommentsService);
  addComment = inject(CommentsService);
  replyingTo = inject(CommentsService);
  willReply = inject(CommentsService);
  idToEdit: number = 0;

  isCurrentUser = currentUser.currentUser.username;
  repTo = output<string>();

  isEditing = signal<boolean>(false);

  @ViewChild('commentContent') commentEl!: ElementRef;

  updateText(id: number) {
    this.idToEdit = id;
    this.isEditing.set(true);
    this.commentEl.nativeElement.focus();
  }

  finishText() {
    this.isEditing.set(false);
  }

  deleteComment(id: number) {
    this.comments.deleteComment(id);
  }

  deleteReply(idOne: number, id: number) {
    this.comments.deleteReply(idOne, id);
  }

  replyTo(event: any) {
    this.replyingTo.replyTo(event);
    this.repTo.emit(this.isCurrentUser);
  }

  constructor() {
    console.log(this.comments);
    console.log(this.replyingTo.replyId());
  }
}
