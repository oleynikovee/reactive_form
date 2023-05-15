import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {Condition, Field, isOpen} from 'src/app/model/fields'
 
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
                "join": "or",
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
        "value": "Variant 1",
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
  conditions:string[]=[];
  reactiveForm!: FormGroup;
  isDesibledSubmit=true;

  isRequiredList:number[]=[];
  isOpenList:isOpen={};
  isClosedList:isOpen={};
  isChengedGL:boolean=false;

  constructor(private formBuilder: FormBuilder, private cdRef:ChangeDetectorRef) {}
 
  ngOnInit() {
    //this.createForm();
    this.addEvents();
    this.validateBtnSubmit();
  }

  addEvents(){
    this.fields.map(field=>{
      field.required?this.isRequiredList.push(field.id):null;
      field.cond.length>0?this.isOpenList[field.id]=false:this.isOpenList[field.id]=true;
    });
  }

  async onChanged(event:any){
    let id=event.target.id;
    await this.isOpenList[id]!=true?this.isOpenList[id]=this.checkConds(id):this.findFalse();
    if(this.isChengedGL==false){
      await this.dirtyCheck();
    }
    this.isChengedGL=false;
    this.validateBtnSubmit();
  }

  findFalse(){
    this.fields.map(field=>{
      this.isOpenList[field.id]!=true?this.isOpenList[field.id]=this.checkConds(field.id.toString()):null;
    });
  }

  dirtyCheck(){
    this.fields.map(field=>{
      field.cond.length>0?this.isOpenList[field.id]=this.reverseCheckConds(field.id.toString()):null;
    });
  }


  checkConds(id:string):boolean{
    let conds:Condition[]=this.fields.find(item=> item.id==parseInt(id))!.cond;
    console.log(conds);
    if(conds[0]?.join=="or"){
      let states:boolean[]=new Array(conds?.length);
      for(let condition of conds){
        let el=document.getElementById(condition.field.toString()) as HTMLInputElement;
        switch(condition.value){
          case "empty":{
            el.value.trim()==""?states.push(true):null;
            break;
          }
          case "fill":{
            (el.value.trim()==el.id && el.checked)?states.push(true):null;
            break;
          }
          default:{
            (el.value==condition.value && el.checked==true)?states.push(true):null;
            break;
          }
        }
      }
      if(states.includes(true)){
        this.isChengedGL=true;
        return true;
      }
      return false;
    }else{
      let states:boolean[]=new Array(conds?.length);
      for(let condition of conds){
        let el=document.getElementById(condition.field.toString()) as HTMLInputElement;
        switch(condition.value){
          case "empty":{
            el.value.trim()==""?states.push(true):states.push(false);
            break;
          }
          case "fill":{
            el.value.trim()!=""?states.push(true):states.push(false);
            break;
          }
          default:{
            (el.value== condition.value && el.checked==true)?states.push(true):states.push(false);
            break;
          }
        }
      }
      return states.every((state) => state === true)
    }
  }

  reverseCheckConds(id:string):boolean{
    let conds:Condition[]=this.fields.find(item=> item.id==parseInt(id))!.cond;
    if(conds[0]?.join=="or"){
      let states:boolean[]=new Array(conds?.length);
      for(let condition of conds){
        let el=document.getElementById(condition.field.toString()) as HTMLInputElement;
        switch(condition.value){
          case "empty":{
            el.value.trim()==""?states.push(false):states.push(true);
            break;
          }
          case "fill":{
            (el.value.trim()==el.id && el.checked==false)?states.push(false):states.push(true);
            break;
          }
          default:{
            (el.value==condition.value && el.checked==false)?states.push(false):states.push(true);
            break;
          }
        }
      }
      if(states.includes(true)){
        this.isChengedGL=true;
        return true;
      }
      return false;
    }else{
      let states:boolean[]=new Array(conds?.length);
      for(let condition of conds){
        let el=document.getElementById(condition.field.toString()) as HTMLInputElement;
        switch(condition.value){
          case "empty":{
            el.value.trim()==""?states.push(false):states.push(true);
            break;
          }
          case "fill":{
            (el.value.trim()==el.id && el.checked==false)?states.push(false):states.push(true);
            break;
          }
          default:{
            (el.value== condition.value && el.checked==true)?states.push(false):states.push(true);
            break;
          }
        }
      }
      return states.every((state) => state === true)
    }
  }
  onSubmit() {
    alert('SUBMIT')
   }
  
  isArrayType(type:any): boolean {
    return Array.isArray(type);
  }

  validateBtnSubmit(){
    let el3=document.getElementById("3") as HTMLInputElement;
    let el4=document.getElementById("4") as HTMLInputElement;
    (el3.checked==true && el4.value!="")?this.isDesibledSubmit=false:this.isDesibledSubmit=true;
  }
}
