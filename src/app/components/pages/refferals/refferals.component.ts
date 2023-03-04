import { Component} from '@angular/core';
interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
  enabl:string;
}
@Component({
  selector: 'app-refferals',
  templateUrl: './refferals.component.html',
  styleUrls: ['./refferals.component.scss']
})
export class RefferalsComponent{
 
  inputValue: string = 'ijfh846y438ufhuie';

 value = 100;
 listOfData: Person[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    enabl:'enable'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    enabl:'enable'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    enabl:'enable'
  }
];

isVisible = false;


constructor() {}

}
