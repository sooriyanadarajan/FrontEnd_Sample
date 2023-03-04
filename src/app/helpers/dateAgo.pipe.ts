import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateAgo',
    pure: false,
})
export class DateAgoPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (value) {
            let seconds;
            if (args == 'timestamp') {
                seconds = Math.floor(
                    (+new Date() - +new Date(new Date(value))) / 1000
                );
            } else {
                seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            }

            if (seconds < 29) return 'Just now';
            const intervals = {
                year: 31536000,
                month: 2592000,
                week: 604800,
                day: 86400,
                hour: 3600,
                min: 60,
                sec: 1,
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return counter + ' ' + i + ' ago';
                    } else {
                        return counter + ' ' + i + 's ago';
                    }
            }
        }
        return value;
    }
}
