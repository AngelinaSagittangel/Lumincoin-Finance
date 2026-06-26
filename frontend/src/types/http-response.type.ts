export interface HttpResponse<T> {
  error: boolean;
  response: T;
  redirect?: string;
  message?: string;
}

export interface HttpErrorResponse {
  error: boolean;
  message: string;
}
