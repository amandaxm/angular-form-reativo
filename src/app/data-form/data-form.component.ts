import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { compileComponentFromMetadata } from '@angular/compiler';
import { DropdownService } from './services/dropdown.service';
import { EstadosBr } from '../shared/models/estados-br.model';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup; // VAI REPRESENTAR O FORMULARIO
  estados: Observable<EstadosBr[]>;
  cargos: any[];
  tecnologias:any[];
  newsletterOp:any[];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
  ) { }

  ngOnInit(): void {
    this.estados = this.dropdownService.getEstadosBr();
   this.cargos=this.dropdownService.getCargos();
   this.tecnologias=this.dropdownService.getTecnologia();
    this.newsletterOp= this.dropdownService.getNewslleter();
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
    cargo:[null],
    tecnologias:[null],
    newsletter: ['s'],

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

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo').setValue(cargo);
  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  setarTecnologia() {
    this.formulario.get('tecnologias').setValue(['java','javascript','angular']);
  }

  
}
