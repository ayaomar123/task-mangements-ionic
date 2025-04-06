import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<{type: string, message: string}>();
  //لما يكون نهاية الاسم $ بعرف لحالي انه نوعه observal
  notifications$ = this.notificationSubject.asObservable();

  success(message: string): void {
    this.notify('success', message);
  }

  error(message: string): void {
    this.notify('error', message);
  }

  private notify(type: string, message: string): void {
    this.notificationSubject.next({ type, message });
  }
}
