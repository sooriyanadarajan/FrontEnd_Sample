import { Injectable } from '@angular/core';
import { NzNotificationService} from 'ng-zorro-antd/notification';
import { NzMessageService} from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private notify: NzNotificationService,
    private message: NzMessageService
) {}

success(title, desc?) {
    this.notify.success(title, desc);
}

error(title, desc?) {
    this.notify.error(title, desc);
}

warning(title, desc?) {
    this.notify.warning(title, desc);
}

info(title, desc?) {
    this.notify.info(title, desc);
}

hideAll() {
    this.notify.remove();
}

toast(text, status) {
    this.message.create(status, text);
}
}
