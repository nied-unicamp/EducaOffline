import { ControlValueAccessor } from '@angular/forms';

export class CustomControl<T> implements ControlValueAccessor {
  public disabled = false;
  public value: T;

  public onChange(newVal: T) { }
  public onTouched(_?: any) { }

  public writeValue(obj: T): void { this.value = obj; }
  public registerOnChange(fn: any): void { this.onChange = fn; }
  public registerOnTouched(fn: any): void { this.onTouched = fn; }
  public setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }
}

