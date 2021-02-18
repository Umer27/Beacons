export interface ConfigurationInterface {
  dbHost: string;
  dbName: string;
  dbPort: number;
  dbUsername: string;
  dbUrl: string;
}
export default (): ConfigurationInterface => {
  const dbHost = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;
  const dbPort = +process.env.DB_PORT ?? 27017;
  const dbUsername = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  return {
    dbHost,
    dbName,
    dbPort,
    dbUsername,
    dbUrl: `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
  };
};
