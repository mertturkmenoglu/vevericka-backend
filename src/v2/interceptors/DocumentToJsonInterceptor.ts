/* eslint-disable import/prefer-default-export */
import { Action, InterceptorInterface } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
export class DocumentToJsonInterceptor implements InterceptorInterface {
  public intercept(_action: Action, result: any): any {
    if (!result) return result;
    return JSON.parse(JSON.stringify(result));
  }
}
