// eslint-disable-next-line @typescript-eslint/no-var-requires
import { getEnvs } from './../../env.config';
import { EnvironmentInterface, ProcessEnvs } from './environment.model';

class Environment implements EnvironmentInterface {
  readonly dbUrl: string;
  readonly authyApiKey: string;
  readonly firebaseClientEmail: string;
  readonly firebasePrivateKey: string;
  readonly firebaseProjectId: string;
  readonly twilioAccountsid: string;
  readonly twilioAuthToken: string;
  readonly twilioSid: string;

  constructor(envs: ProcessEnvs | NodeJS.ProcessEnv) {
    this.authyApiKey = envs.AUTHY_API_KEY;
    this.dbUrl = envs.DB_URL;
    this.firebaseClientEmail = envs.FIREBASE_CLIENT_EMAIL;
    // For the reason of replacing new lines @see https://stackoverflow.com/a/41667023/4640909
    this.firebasePrivateKey = envs.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    this.firebaseProjectId = envs.FIREBASE_PROJECT_ID;
    this.twilioAccountsid = envs.TWILIO_ACCOUNTSID;
    this.twilioAuthToken = envs.TWILIO_AUTH_TOKEN;
    this.twilioSid = envs.TWILIO_SID;
  }
}

export const environment = new Environment(getEnvs());
