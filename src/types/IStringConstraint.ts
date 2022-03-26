import { IConstraint } from './IConstraint';

export interface IStringConstraint extends IConstraint {
  min: number;
  max: number;
}
