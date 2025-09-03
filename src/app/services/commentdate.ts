import { Injectable, inject } from '@angular/core';
import { CommentsService } from './comments';

@Injectable({
  providedIn: 'root',
})
export class Commentdate {
  date = new Date().getTime();
  datePublished = inject(CommentsService).datePublished;
}
