import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { Employee } from 'src/app/shared/models/employee/employee';
import { EmployeeService } from 'src/app/shared/pages-routing/employee/employee.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent {
  @Input() employeeEmail: string | undefined;
  employee: Employee | undefined;
  fileName: string | undefined;
  constructor(public bsModalRef: BsModalRef,
    private employeeService: EmployeeService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getEmployee();
  }

  editEmployeeProfile() {
    this.sharedService.openEditEmployeeModal();
    this.bsModalRef.hide();
  }

  private getEmployee() {
    if (this.employeeEmail) {
      this.employeeService.employee$.subscribe({
        next: (response: any) => {
          this.employee = response;
        }
      })
    }
  }

  downloadPDF() {
    if (this.employeeEmail) {
      this.employeeService.employee$.pipe(take(1)).subscribe({
        next: (response: any) => {
          this.fileName = response.firstName;
        }
      })
      this.employeeService.getPDFFile(this.employeeEmail).subscribe({
        next: (response: Blob) => {
          const blobUrl = window.URL.createObjectURL(response);  // Create a Blob object URL for the downloaded file       
          const a = document.createElement('a');// Create an anchor element and trigger a click to start the download
          a.href = blobUrl;
          a.download = this.fileName + '_cv.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a); // Cleanup: Remove the anchor and revoke the Blob URL
          window.URL.revokeObjectURL(blobUrl);
          this.sharedService.showNotification(true, 'Успешно сваляне.', 'Вашето CV беше свалено успешно!');
        },
        error: (error: any) => {
          this.sharedService.showNotification(false, 'Грешка при сваляне', error.message);
        }
      });
    }
  }

  openQRCodeModal() {
    this.sharedService.openQRCodeModal();
  }
}
