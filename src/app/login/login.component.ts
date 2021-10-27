import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  correo: string = "";

  constructor(
    public router: Router,
    public _adminService: AdminService
  ) { }

  ngOnInit(): void {
  }

  public login(forma: NgForm){
    if(forma.invalid) {
      return;
    }
  
    this._adminService.login(forma.value.correo, forma.value.password)
      .subscribe(correcto =>
          {
            
            localStorage.setItem('tokenHat', correcto.token);
            localStorage.setItem('userHat', JSON.stringify(correcto.usuario));
            this.router.navigate(['/solicitud']);
          },
          error => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              text: error.error.message,
              showClass: {
                popup: 'animated fadeInDown faster'
              },
              hideClass: {
                popup: 'animated fadeOutUp faster'
              }
            });
          }
      )
  }

}
