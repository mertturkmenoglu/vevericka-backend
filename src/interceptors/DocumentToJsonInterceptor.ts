/* eslint-disable import/prefer-default-export */
import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { Service } from 'typedi';

@Interceptor()
@Service()
export class DocumentToJsonInterceptor implements InterceptorInterface {
  public intercept(_action: Action, result: any): any {
    if (!result) return result;
    return JSON.parse(JSON.stringify(result));
  }
}
