
module.exports = {
  // Environment
  ENV: process.env.ENV,

  // HOST
  PORT: process.env.ENV === 'DEV' ? process.env.PORT_DEV : process.env.PORT_PROD,
  HOST: process.env.ENV === 'DEV' ? process.env.HOST_DEV : process.env.HOST_PROD,

  // API
  API_URL: process.env.ENV === 'DEV' ? process.env.API_URL_DEV : process.env.API_URL_PROD,

  // DB
  DATABASE_URL: process.env.DATABASE_URL,

  // GOOGLE
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,

  // SMTP
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
}