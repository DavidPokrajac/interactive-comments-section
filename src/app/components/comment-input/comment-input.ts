import { Component, input, output, inject } from '@angular/core';
import currentUser from '../../../../data.json';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommentsService } from '../../services/comments';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-comment-input',
  imports: [ReactiveFormsModule],
  templateUrl: './comment-input.html',
  styleUrl: './comment-input.scss',
})
export class CommentInput {
  currentUser = currentUser.currentUser;
  isReply = input();
  willReply = inject(CommentsService);
  repTop = input<string>();
  label = input('');

  addCommentEvent = output<{
    user: {
      username: string;
      image: {
        webp: string;
      };
    };
    content: string;
    score: number;
    isReplying: unknown;
    id: string;
  }>();

  newComment = new FormGroup({
    content: new FormControl(``, {
      nonNullable: true,
    }),
  });

  addComment(event: any) {
    event.preventDefault();
    const content = this.newComment.getRawValue().content as string;
    this.newComment.reset();
    this.willReply.willReply.set([false, null]);
    this.addCommentEvent.emit({
      id: uuidv4(),
      content: content,
      user: {
        username: currentUser.currentUser.username,
        image: {
          webp: currentUser.currentUser.image.webp,
        },
      },
      score: 0,
      isReplying: this.isReply() ? true : false,
    });
  }
}
