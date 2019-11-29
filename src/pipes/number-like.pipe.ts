import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberlike' })
export class NumberLikePipe implements PipeTransform {
    transform(value: number) {
        if (value) {
            return this.intToString(value);
        }
        return 0;
    }

    intToString(value, digits = 1) {
        const si = [
            { value: 1, symbol: '' },
            { value: 1E3, symbol: 'k' },
            { value: 1E6, symbol: 'M' },
            { value: 1E9, symbol: 'G' },
            { value: 1E12, symbol: 'T' },
            { value: 1E15, symbol: 'P' },
            { value: 1E18, symbol: 'E' }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (value >= si[i].value) {
                break;
            }
        }
        return (value / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
    }
}
