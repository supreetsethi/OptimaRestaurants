import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Manager } from 'src/app/shared/models/manager/manager';
import { Restraurant } from 'src/app/shared/models/restaurant/restaurant';
import { AccountService } from 'src/app/shared/pages/page-routing/account/account.service';
import { ManagerService } from 'src/app/shared/pages/page-routing/manager/manager.service';

@Component({
  selector: 'app-edit-manager',
  templateUrl: './edit-manager.component.html',
  styleUrls: ['./edit-manager.component.css',
    '../../../../../app.component.css']
})
export class EditManagerComponent {
  editManagerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  email: string | null = this.accountService.getEmail();
  manager: Manager | undefined;

  constructor(public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private managerService: ManagerService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.editManagerForm = this.formBuilder.group({
      newFirstName: ['', []],
      newLastName: ['', []],
      newPhoneNumber: ['', []],
      newPictureUrl: ['', []]
    })
  }

  editManager() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.editManagerForm.valid && this.email) {
      this.managerService.updateManagerAccount(this.editManagerForm.value, this.email).subscribe({
        next: (response: any) => {
          this.managerService.setManager(response);
          this.bsModalRef.hide();
        },
        error: error => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
        }
      });
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    // Implement the logic to upload the image to our server
    // After the image is uploaded, set the URL to the restaurant.iconUrl property

    // For example, with a service named imageService
    // this.imageService.uploadImage(file).subscribe((imageUrl) => {
    //   this.restaurant.iconUrl = imageUrl;
    // });
  }

  saveImage(restaurant: Restraurant): void {
    // Save the restaurant object with the image URL
    console.log('Image URL:', restaurant.iconUrl);
    // Implement the logic to save the restaurant object
  }
}