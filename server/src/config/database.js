export const databaseConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz-system',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    },
  },
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

export const serverConfig = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://43.250.40.133:5175',
};

export const dockerConfig = {
  host: process.env.DOCKER_HOST,
  certPath: process.env.DOCKER_CERT_PATH,
  tlsVerify: process.env.DOCKER_TLS_VERIFY === '1',
};