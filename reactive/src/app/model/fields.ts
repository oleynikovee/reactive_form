import { NgIterable } from "@angular/core";

export interface Field {
    id: number;
    type: string;
    value: any;
    required: boolean;
    cond: Condition[];
  }
  
  export interface Condition {
    join: string;
    field: number;
    value: string;
  }

  export type isOpen=Record<string,boolean>;