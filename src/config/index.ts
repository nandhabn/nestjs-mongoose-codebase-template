// Names of the Config variables
export enum Config {
  PORT = 'port',
  BACKEND_PREFIX = 'backendPrefix',
  MONGO_URI = 'mongoUri',
  JWT_SECRET_KEY = 'jwtSecretKey',
  CORS_URLS = 'corsUrls',

  SWAGGER_TITLE = 'swaggerTitle',
  SWAGGER_DESCRIPTION = 'swaggerDescription',
  SWAGGER_VERSION = 'swaggerVersion',
  SWAGGER_PREFIX = 'swaggerPrefix',
}

// Type of the envs
export type Environment = {
  [Config.PORT]: number;
  [Config.BACKEND_PREFIX]: string;
  [Config.MONGO_URI]: string;
  [Config.JWT_SECRET_KEY]: string;
  [Config.CORS_URLS]: string[] | string;
  [Config.SWAGGER_TITLE]: string;
  [Config.SWAGGER_DESCRIPTION]: string;
  [Config.SWAGGER_VERSION]: string;
  [Config.SWAGGER_PREFIX]: string;
};

// Parses the env and validate them
export const parse = (): Environment => {
  const env: Environment = {
    port: Number(process.env.PORT),

    backendPrefix: process.env.BACKEND_PREFIX,
    mongoUri: process.env.MONGO_URI,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    corsUrls: process.env.CORS_URLS?.split(',') ?? '*',

    // Swagger Envs
    swaggerTitle: process.env.SWAGGER_TITLE,
    swaggerDescription: process.env.SWAGGER_DESCRIPTION,
    swaggerVersion: process.env.SWAGGER_VERSION,
    swaggerPrefix: process.env.SWAGGER_PREFIX,
  };

  if (Number.isNaN(env.port) || env.port < 1) {
    console.warn('Invalid Port Number. Using default port number 3002');
    env.port = 3002;
  }

  return env;
};

export default Config;
