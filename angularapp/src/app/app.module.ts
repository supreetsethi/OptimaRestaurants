import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './shared/account-pages/login/login.component';
import { RegisterManagerComponent } from './shared/account-pages/register-manager/register-manager.component';
import { IndexComponent } from './shared/account-pages/index/index.component';
import { RegisterEmployeeComponent } from './shared/account-pages/register-employee/register-employee.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SharedModule } from './shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ManagerLoggedViewComponent } from './shared/logged-pages/manager-logged-view/manager-logged-view.component';
import { EmployeeLoggedViewComponent } from './shared/logged-pages/employee-logged-view/employee-logged-view.component';
import { StarRatingComponent } from './shared/components/misc/star-rating/star-rating.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterManagerComponent,
    IndexComponent,
    RegisterEmployeeComponent,
    ManagerLoggedViewComponent,
    EmployeeLoggedViewComponent,
    NavbarComponent,
    StarRatingComponent
  ],
  imports: [
    BrowserModule, 
    SharedModule,
    HttpClientModule, 
    AppRoutingModule, ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
