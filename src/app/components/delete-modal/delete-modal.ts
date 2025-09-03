import { Component, inject } from '@angular/core';
import { CommentsService } from '../../services/comments';

@Component({
  selector: 'app-delete-modal',
  imports: [],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.scss',
})
export class DeleteModal {
  modal = inject(CommentsService);
  isComment = this.modal.isComment;
}
