import { Injectable, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FileUploaded } from '../models/file-uploaded.model';

@Injectable()
export abstract class Form<A> implements OnInit {
  form: FormGroup;
  value: A;

  valueIsValid = false;

  formErrors: any = {};

  translationText;

  courseId: number;

  isEditing = false;

  routeData: any;

  protected fb: FormBuilder;
  protected route: ActivatedRoute;
  protected router: Router;

  constructor(protected injectorObj: Injector) {
    this.fb = injectorObj.get(FormBuilder);
    this.route = injectorObj.get(ActivatedRoute);
    this.router = injectorObj.get(Router);
  }


  /**
   * Note: If overwriting, take care to keep the current function calls
   */
  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit() {
    this.resolveData();
    this.resetForm();
  }

  protected valuePointer(): A | Observable<A> {
    return null;
  }

  protected valuePointerWrapper(): Observable<A> {
    if (this.valuePointer() instanceof Observable) {
      if (this.valueIsValid) {
        return of(this.value);
      } else {
        return this.valuePointer() as Observable<A>;
      }
    }

    return of(this.valuePointer() as A);
  }

  protected resolveData() {
    this.route.data.subscribe((data: any) => {
      this.routeData = data;
      this.courseId = data.course?.id;

      this.valuePointerWrapper().subscribe(value => {

        if (value) {
          this.isEditing = true;
          this.value = value;
        } else {
          this.value = this.getBlank();
        }
        this.valueIsValid = true;

        this.resetForm(true);
      });
    });
  }

  // Instantiate the object this.form
  protected abstract buildForm(): FormGroup;

  protected getDefault(): A {
    const myValue = this.value;
    if (myValue) {
      return myValue;
    }
    return this.getBlank();
  }

  protected abstract getBlank(): A;

  protected abstract create(): void;

  protected edit(): void {
    throw new Error('Method edit() not implemented.');
  }

  /**
   * If the form is already built, reset it with the new values, if not, instantiate it!
   *
   * Note: We do it this way because I figured out that it is not good to
   * reinitialize formGroup over and over again, because the custom formControl
   * component looses reference to old formGroup (=> errors).
   */
  protected resetForm(force = false) {

    if (!this.form || force) {
      if (!this.value) {
        this.value = this.getBlank();
        this.valueIsValid = false;
      }

      this.form = this.buildForm();
      this.form.valueChanges.subscribe(data => this.onValueChanged(data));

    } else {

      const myNewForm = this.buildForm().value;
      this.form.reset(myNewForm);

    }
  }

  // Put additional functions here that will be executed when the value changes
  protected onValueChange2() { }


  /**
   * When any form value is changed, find errors and set messages to be shown
   */
  private onValueChanged(data?: any) {
    if (!this.form) { return; }
    const form = this.form;
    this.onValueChange2();

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.translationText?.validationMessages[field];
        // eslint-disable-next-line guard-for-in
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  /**
   * When the user clicks on the submit button, sends the form data to the server
   */
  onSubmit() {
    if (this.isEditing) {
      this.edit();
    } else {
      this.create();
    }
  }
}

export abstract class FormWithFiles<A> extends Form<A> {

  constructor(protected injectorObj: Injector) {
    super(injectorObj);
  }

  filesToUpload: File[];
  uploadedFiles: FileUploaded[];
  filesToDelete: FileUploaded[];


  /**
   * If you want to get files in this form,
   *
   * return this.activitiesService.getFiles(this.courseId, this.value?.id);
   */
  protected filesObservable: Observable<FileUploaded[]>;

  protected resolveData() {
    this.route.data.subscribe((data: any) => {
      this.routeData = data;
      this.courseId = data.course?.id;

      this.valuePointerWrapper().subscribe(value => {
        if (value) {
          this.isEditing = true;
          this.value = value;

          this.setFilesObservable();

          if (this.filesObservable) {
            this.filesObservable.subscribe((files: FileUploaded[]) => {
              this.uploadedFiles = [...files];
            });
          } else {
            console.warn('No files observable found! Something is wrong =(');
          }
        } else {
          this.value = this.getBlank();
        }

        this.valueIsValid = true;
        this.resetForm(true);
      });

    });
  }

  protected abstract setFilesObservable(): void;

  addFiles(files: File[]) {
    this.filesToUpload = [];
    files?.forEach(file => this.filesToUpload.push(file));
  }

  removeFiles(files: FileUploaded[]) {
    this.filesToDelete = [];
    files?.forEach(file => this.filesToDelete.push(file));
  }
}

