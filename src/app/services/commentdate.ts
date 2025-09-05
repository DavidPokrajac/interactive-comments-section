import { Injectable, inject, signal } from '@angular/core';
import { CommentsService } from './comments';

@Injectable({
  providedIn: 'root',
})
export class Commentdate {
  date = new Date().getTime();
  datePublished = inject(CommentsService).datePublished;
  dateDifference = signal(null);

  getDate() {
    if (this.datePublished()) {
      this.dateDifference.update((date) => {
        console.log(this.date - this.datePublished().getTime());
        return date;
      });
    }
  }
}
