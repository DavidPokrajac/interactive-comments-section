import { Component, signal, inject } from '@angular/core';
import { Comments } from './components/comments/comments';
import { CommentInput } from './components/comment-input/comment-input';
import { CommentsService } from './services/comments';
import { DeleteModal } from './components/delete-modal/delete-modal';

@Component({
  selector: 'app-root',
  imports: [Comments, CommentInput, DeleteModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('interactive-comments-section');
  comments = inject(CommentsService);
}
