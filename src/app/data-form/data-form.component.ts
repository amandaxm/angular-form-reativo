import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup; // VAI REPRESENTAR O FORMULARIO

  constructor() { }

  ngOnInit(): void {
    this.formulario= new FormGroup(
      {
        nome: new FormControl(null),
        email: new FormControl(null),
      }
    );

  }

}
