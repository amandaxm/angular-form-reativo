import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EstadosBr } from '../../shared/models/estados-br.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr(): Observable<EstadosBr[]> {
    return this.http.get<EstadosBr[]>('assets/dados/estadosbr.json');
  }

  getCargos() {
    return [
      { ome: 'Dev', nivel: 'Junior', desc: 'Dev Jr' },
      { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' },
      { nome: 'Dev', nivel: 'Senior', desc: 'Dev Sr' }

    ];

  }
  getTecnologia(){
    return[
      {nome: 'java', desc:'Java'},
      {nome: 'php', desc:'JavaScript'},
      {nome: 'angular', desc:'Angular'},
    ];
  }

  getNewslleter(){
    return[
      {valor: 's', desc:'Sim'},
      {valor: 'n',desc:'Não'}
    ];

  }
}
