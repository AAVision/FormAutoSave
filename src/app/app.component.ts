import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime,switchMap } from 'rxjs/operators';
import  *  as CryptoJS from  'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FormAutoSave';
  dataForm:FormGroup

  key;

  ngOnInit() {
    this.dataForm = new FormGroup({
      name: new FormControl(null,[Validators.required]),
      email: new FormControl(null,[Validators.required,Validators.email]),
      password: new FormControl(null,[Validators.required,Validators.maxLength(32),Validators.minLength(6)])
    });

    this.saveAndGet();
  }

  onSubmit(){
    localStorage.removeItem("dataForm")
    this.dataForm.reset();
  }

  get f(){
    return this.dataForm.controls;
  }

  saveAndGet(){
    if(localStorage.getItem('dataForm')){
      let data = JSON.parse(localStorage.getItem('dataForm'));

      for (const [key, value] of Object.entries(data)) {
        this.f[key].setValue(value)
      }
    }

    this.dataForm.valueChanges
    .pipe(
      debounceTime(2500),
      switchMap((value) => of(value))
    )
    .subscribe((value) => {
      localStorage.setItem("dataForm",JSON.stringify(value));

    });
  }



}
