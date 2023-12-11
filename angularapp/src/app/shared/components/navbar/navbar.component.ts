import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../pages-routing/account/account.service';
import { ManagerService } from '../../pages-routing/manager/manager.service';
import { User } from '../../models/account/user';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { EmployeeService } from '../../pages-routing/employee/employee.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User | null | undefined;

  constructor(public accountService: AccountService,
    public managerService: ManagerService,
    public employeeService: EmployeeService,
    public sharedService: SharedService,
    public router: Router) { }

  ngOnInit() {
    this.accountService.user$.subscribe(user => {
      this.user = user;
      if (this.user && user) {
        if (this.user.isManager) {
          this.managerService.getManager(this.user.email).subscribe({
            next: (response: any) => {
              this.managerService.setManager(response);
            }
          })
        }
        else {
          this.employeeService.getEmployee(this.user.email).subscribe({
            next: (response: any) => {
              this.employeeService.setEmployee(response);
            }
          })
        }
      }
    });
  }

  logout() {
    if (this.user?.isManager) {
      this.managerService.logout();
    } else {
      this.employeeService.logout();
    }
  }

  homePage() {
    if (this.user) {
      if (this.user.isManager) {
        this.router.navigateByUrl('/manager');
      }
      else {
        this.router.navigateByUrl('/employee');
      }
    }
    else {
      this.router.navigateByUrl('/');
    }
  }


  employeeSearch() {
    this.router.navigateByUrl('/manager/employees-looking-for-job');
  }

  contact() { }

  help() { }

  allRestaurants() {
    this.router.navigateByUrl('/restaurants');
  }

}
