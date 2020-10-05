import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup; // VAI REPRESENTAR O FORMULARIO

  constructor( private formBuilder: FormBuilder,     
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required,Validators.minLength(3), Validators.maxLength(50)]],
      email: [null,[Validators.required, Validators.email]]
    });

  }

  onSubmit(){
     console.log(this.formulario.value);
     this.http.post('http://httpbin.org/post',JSON.stringify(this.formulario.value))
     .subscribe(dado => {
       console.log(dado);
       // reseta o form
       this.resetar();
      },
      (error: any) => alert('erro'));

  }

  resetar(){
    this.formulario.reset();
  }

}
