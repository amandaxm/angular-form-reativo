import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataFormComponent } from './data-form/data-form.component';
import { ArgumentOutOfRangeError } from 'rxjs';


const routes: Routes = [
  {path: 'dataForm', component: DataFormComponent},
  {path: '', pathMatch: 'full', redirectTo: 'dataForm'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
