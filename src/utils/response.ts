import IResponse from '../responses/IResponse';

const response = <T>(data: T): IResponse<T> => ({ data });

export default response;
