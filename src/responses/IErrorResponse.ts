interface IError {
  message: string
  statusCode: number
}

interface IErrorResponse {
  errors: IError[]
}

export default IErrorResponse;
