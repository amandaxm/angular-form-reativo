import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EstadosBr } from '../../shared/models/estados-br.model';


@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  

 
  getEstadosBr() {
    return this.http.get<EstadosBr[]>('assets/dados/estadosbr.json');
  }

}
