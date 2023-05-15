import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {Field} from 'src/app/model/fields'
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  fields:Field[]=
  [
    {
        // id поля
        "id": 1,
        // тип поля
        "type": "text",
        // заповнювач, або варінти для поля
        "value": "Text field",
        // обов`язковість
        "required": false,
        // умова відображення
        "cond": [
            {
                // Як взаємдіють вимоги ("and", "or")
                "join": "",
                // id поля яке перевіряється
                "field": 2,
                // Значення яке повинно бути у поля ("empty", "fill", "<radion_variant>")
                "value": "fill"
            },
            {
                "join": "or",
                "field": 3,
                "value": "Variant 1"
            },
        ]
    },
    {
        "id": 2,
        "type": "checkbox",
        "value": "Simple check",
        "required": false,
        "cond": []
    },
    {
        "id": 3,
        "type": "radio",
        "value": [
            "Variant 1",
            "Variant 2"
        ],
        "required": true,
        "cond": []
    },
    {
        "id": 4,
        "type": "number",
        "value": 100,
        "required": true,
        "cond": []
    }
  ];
  reactiveForm!: FormGroup;
  isChecked:boolean=false;
  selectedRadio:string="";
  selectedNumber:string="";
  isDesibledSubmit=true;
  isDesibledText=true;

  constructor(private formBuilder: FormBuilder, private cdRef:ChangeDetectorRef) {}
 
  ngOnInit() {
    this.createForm();
    this.validateBtnSubmit();
  }
  createForm(){
    const formControls:Record<number, any> = {};
    for (const field of this.fields) {
      formControls[field.id]=[null, field.required ? Validators.required : null];
    } 
    this.reactiveForm = this.formBuilder.group(formControls);
  }
   onSubmit() {
    alert('SUBMIT')
   }
  
   isArrayType(type:any): boolean {
    return Array.isArray(type);
  }

  onPressNumber(event:any){
    this.selectedNumber=event.target.value;
    this.validateBtnSubmit();
  }

  onRadioSelected(event:any){
    this.selectedRadio=event.target.value;
    this.validateBtnSubmit();
    this.validateTextField();
  }

  onCheckboxChange(checked: boolean) {
    this.isChecked = checked;
    this.validateTextField();
  }

  validateBtnSubmit(){
    (this.selectedRadio!="" && this.selectedNumber!="")?this.isDesibledSubmit=false:this.isDesibledSubmit=true;
  }

  validateTextField(){
    (this.selectedRadio=="Variant 1" && this.isChecked==true)?this.isDesibledText=false:this.isDesibledText=true;
  }
}
