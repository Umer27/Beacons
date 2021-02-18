export interface EnvironmentInterface {
  dbUrl: string;
  authyApiKey: string;
  firebasePrivateKey: string;
  firebaseClientEmail: string;
  firebaseProjectId: string;
  twilioAccountsid: string;
  twilioAuthToken: string;
  twilioSid: string;
}

export interface ProcessEnvs {
  DB_URL: string;
  AUTHY_API_KEY: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PROJECT_ID: string;
  TWILIO_ACCOUNTSID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_SID: string;
}
