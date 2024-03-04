import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Material } from 'src/app/models/material.model';
import { MaterialActions } from 'src/app/state/material/material.actions';
import { Form } from 'src/app/templates/form';
import { MaterialService } from './../material.service';
import { MaterialForm } from 'src/app/models/material.model';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-material-create-link',
  templateUrl: './material-create-link.component.html',
  styleUrls: ['./material-create-link.component.css']
})
export class MaterialCreateLinkComponent extends Form<Material> implements OnInit, OnDestroy {

  @Input() link: Material = null;
  @Input() folderId: number = null;

  @Output() sent: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeForm = new EventEmitter<void>();

  validLink = false;

  translationText: typeof LANGUAGE.material.MaterialCreateLinkComponent;
  private translationSubscription: Subscription | undefined;

  formErrors = {
    title: '',
    link: ''
  }

  constructor(
    injectorObj: Injector,
    private store: Store,
    private materialService: MaterialService,
    private translationService: TranslationService
  ) {
    super(injectorObj);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.translationText = translation.material.MaterialCreateLinkComponent
          }
       );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  valuePointer() {
    return this.link;
  }

  getBlank(): Material {
    return {} as Material;
  }

  setText(): void { }

  protected buildForm(): FormGroup {
    const linkREG = new RegExp(
      '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'
    );

    const form = this.fb.group({
      title: [this.value.title, [
        Validators.required,
        Validators.minLength(3),
      ]],
      link: [this.value?.link, [
        Validators.required,
        Validators.pattern(linkREG)
      ]]
    });

    this.setCallbacks(form);

    return form;
  }

  protected create(): void {

    const formV = this.form.value;
    const materialForm: MaterialForm = {
      title: formV.title,
      link: formV.link,
      description: formV.description,
    }

    this.store.dispatch(MaterialActions.create.link.request({
      input: {
        body: materialForm,
        courseId: this.courseId,
        folderId: this.folderId
      }
    }))

    this.closeForm.emit();
  }

  edit() {

    const formV = this.form.value;
    const materialForm: MaterialForm = {
      title: formV.title,
      link: formV.link,
      description: formV.description,
    }

    this.store.dispatch(MaterialActions.editLink.request({
      input: {
        courseId: this.courseId,
        materialId: this.link?.id,
        body: materialForm
      }
    }))

    this.closeForm.emit();
  }

  private setCallbacks(form: FormGroup) {
    // Watch value changes on the control
    const linkControl = form.controls['link'];

    // Only valid links with a debounce time of 1000ms should call an update to the title
    linkControl.valueChanges.pipe(
      filter(_ => linkControl.valid),
      debounceTime(1000),
      map((currentLink: string) => {
        if (currentLink[0] !== 'h') {
          const newLink = 'http://' + currentLink;
          linkControl.setValue(newLink, { emitEvent: false });

          return newLink;
        }
        return currentLink;
      })
    ).subscribe(_ => {
      this.validLink = true;
      this.updateTitle();
    });

    linkControl.statusChanges.pipe(
      filter(status => status === 'INVALID')
    ).subscribe(_ => {
      this.validLink = false;
      form.controls['title'].reset();
    });
  }

  // Set the link title automatically
  private updateTitle() {

    const linkControl = this.form.get('link');
    const titleControl = this.form.get('title');

    // If you are editing the link and it did not change, do not update the title
    if (this.link && this.link?.link === linkControl.value) {
      return;
    }

    // Update the title
    this.materialService.getUrlTitle(linkControl.value).subscribe((title: string) => {
      if (title !== null && title !== '') {
        titleControl.setValue(title);
        titleControl.markAsDirty();
      }
    });
  }
}
