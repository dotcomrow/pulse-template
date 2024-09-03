declare global {  
    namespace NodeJS {  
        interface ProcessEnv {  
            [key: string]: string | undefined;  
            // The KV Namespace binding type used here comes  
            // from `@cloudflare/workers-types`, in order to            
            // use it like so, make sure that you have installed            
            // the package as a dev dependency and you have added            
            // it to your `tsconfig.json` file under            
            // `compilerOptions.types`.            DB: D1Database;  
            CACHE: D1Database;
            GCP_LOGGING_PROJECT_ID:string;
            GCP_LOGGING_CREDENTIALS:string;
            LOG_NAME:string;
            ENVIRONMENT:string;
            VERSION:string;
        }  
    }  
}  
  
export {};