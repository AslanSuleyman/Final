import { Pipe } from '@angular/core';

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe {
    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
                return 'Şimdi';
            const intervals = {
                'yıl': 31536000,
                'ay': 2592000,
                'hafta': 604800,
                'gün': 86400,
                'saat': 3600,
                'dakika': 60,
                'saniye': 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return counter + ' ' + i + ' önce'; // singular (1 day ago)
                    } else {
                        return counter + ' ' + i + ' önce'; // plural (2 days ago)
                    }
            }
        }
        return value;
    }
}
