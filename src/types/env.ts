declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_SECRET: string;
      ELASTIC_DEV_PASSWORD: string;
      DEFAULT_USERNAME: string;
      DEFAULT_PASSWORD: string;
      TWILIO_ACCOUNT_SID: string;
      TWILIO_ACCOUNT_AUTHTOKEN: string;
      NEXT_PUBLIC_PROJECT_BASE_URL: string;
    }
  }
}
export {};
