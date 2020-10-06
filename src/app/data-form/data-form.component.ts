import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { compileComponentFromMetadata } from '@angular/compiler';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup; // VAI REPRESENTAR O FORMULARIO

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [null, [Validators.required, Validators.email]],
     
      endereco: this.formBuilder.group({
      cep: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null],
      rua: [null, Validators.required],
      bairro: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required],
    }),
    });

  }

  onSubmit() {
    console.log(this.formulario.value);
    if(this.formulario.valid){
      this.http.post('http://httpbin.org/post', JSON.stringify(this.formulario.value))
      .subscribe(dado => {
        console.log(dado);
        // reseta o form
        this.resetaDadosForm();
      },
        (error: any) => alert('errado'));

    }else{
      console.log('Formulário inválido');
     this.verificaValidacoesForm(this.formulario);
    }
    
  }
  consultaCEP() {
    let cep = this.formulario.get('endereco.cep').value;

    cep = cep.replace(/\D/g, '');

    // Verifica se campo cep possui valor informado.
    if (cep !== '') {
      // Expressão regular para validar o CEP.
      const validacep = /^[0-9]{8}$/;

      // Valida o formato do CEP.
      if (validacep.test(cep)) {
        return this.http.get(`//viacep.com.br/ws/${cep}/json`)
        .subscribe(dados=> this.populaDadosForm(dados));
      }
    }
  }

  verificaValidacoesForm(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach((campo =>{
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsTouched();
      if(controle instanceof FormGroup){
        this.verificaValidacoesForm(controle);
      }
    }));

  }

  populaDadosForm(dados) {
    // this.formulario.setValue({});

    this.formulario.patchValue({//correção nos dados
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

    resetaDadosForm() {
      this.formulario.patchValue({
        endereco: {
          rua: null,
          complemento: null,
          bairro: null,
          cidade: null,
          estado: null
        }
      });
    }
  verificaValidTouched(campo) {
  }
  aplicaCssErro(campo) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }
}
