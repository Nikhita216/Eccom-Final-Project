import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);

        const role = response.user.role[0].roleName;
        /*alert('Login Successful!');*/

        if (role === 'Admin') {

          this.router.navigate(['/admin']);
        } else
        {
          this.router.navigate(['/user']);
        }
      },
      (error) => {
        alert("Invalid Username or password");
        console.log(error);
        loginForm.reset();
      }
    );
  }
  registerUser(){
    this.router.navigate(['/register']);
  }
}
