export interface Config{
    jwt:{
        secret:string,
        expiresIn: string|number
    };

    google:{
        clientId:string,
        clientSecret:string,
        callbackUrl:string
    };

    database:{
        host:string,
        port:number,
        dialect:"mysql"|"postgres",
        logging:boolean,
        databaseName:string,
        user:string,
        password:string,
        dialectOptions?: Record<string, unknown>,
    },
    bcryptSalRounds:number;
    nodeEnv:string;
    port:number;
    frontendUrl:string;
    cookieDomain:string;
    isDev:boolean;
    host:string
}
