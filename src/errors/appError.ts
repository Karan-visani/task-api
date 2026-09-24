export class AppError extends Error{
    statusCode:number;
    errors?:unknown

    constructor(message:string,statusCode:number,errors?:unknown){
        super(message)
        this.statusCode = statusCode
        this.errors = errors

        this.name = "AppError"
    }
}

export class NotFoundError extends AppError{
    constructor(message:string){
        super(message,404);
        this.name = "NotFoundError"
    }
}

export class BadRequestError extends AppError{
    constructor(message:string,errors?:unknown){
        super(message,400,errors);
        this.name = "BadRequestError"
    }
}