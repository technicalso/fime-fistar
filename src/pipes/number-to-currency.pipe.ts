import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatnumber' })
export class NumberToCurrencyPipe implements PipeTransform {
    transform(value: number) {
        if (value) {
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        }
        return 0;
    }
}
