/* eslint-disable import/prefer-default-export */
import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { Service } from 'typedi';

@Interceptor()
@Service()
export class DocumentToJsonInterceptor implements InterceptorInterface {
  public intercept(_action: Action, result: any): any {
    if (Array.isArray(result) && 'toJSON' in result[0]) {
      return result.map((it) => it.toJSON());
    }

    if ('toJSON' in result) {
      return result.toJSON();
    }

    return result;
  }
}
