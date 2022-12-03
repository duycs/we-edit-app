import { ProductLevel } from "./productLevel";
import { Staff } from "./staff";

export interface Job {
  date: Date;
  location: number;
  csoId: number;
  cso: Staff;
  jobId: string;
  code: string;
  instruction: string;
  inputInfo: string;
  outputInfo: string;
  inputNumber: number;
  outputNumber: number;
  deliverType: number;
  deadline: Date;
  app: number;
  productLevelId: number;
  productLevel: ProductLevel;
  startTime: Date;
  endTime: Date;
  status: number;
  jobSteps: [];
  steps: [];
  id: number;

  locationname: string;
  statusname: string;
  appname: string;
}