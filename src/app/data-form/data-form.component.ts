import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { compileComponentFromMetadata } from '@angular/compiler';
import { DropdownService } from './services/dropdown.service';
import { EstadosBr } from '../shared/models/estados-br.model';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup; // VAI REPRESENTAR O FORMULARIO
  estados: EstadosBr[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
  ) { }

  ngOnInit(): void {
    this.dropdownService.getEstadosBr()
      .subscribe((dados: EstadosBr[]) => {
        this.estados = dados;
      }
      );
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
      if(this.formulario.valid) {
      this.http.post('http://httpbin.org/post', JSON.stringify(this.formulario.value))
        .subscribe(dado => {
          console.log(dado);
          // reseta o form
          this.resetaDadosForm();
        },
          (error: any) => alert('errado'));

    } else {
      console.log('Formulário inválido');
      this.verificaValidacoesForm(this.formulario);
    }

  }


  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    }));

  }

  consultaCEP() {
    const cep = this.formulario.get('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados));
    }
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

  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }
}
