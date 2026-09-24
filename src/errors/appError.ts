export class AppError extends Error{
    statusCode:number;

    constructor(message:string,statusCode:number){
        super(message)
        this.statusCode = statusCode

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
    constructor(message:string){
        super(message,400);
        this.name = "BadRequestError"
    }
}