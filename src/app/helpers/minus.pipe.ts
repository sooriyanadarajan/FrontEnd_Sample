
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minus',
    pure: true
})
export class MinusPipe implements PipeTransform {

    transform(value: any): any {
        if (value && value < 0) {
            return value * -1
        }
        return value;
    }

}