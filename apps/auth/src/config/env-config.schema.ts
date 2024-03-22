import Joi from 'joi';

export const envConfigValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  APP_ID: Joi.string().required(),
  RABBIT_MQ_URI: Joi.string().required(),
  RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
  RABBIT_MQ_USER_QUEUE: Joi.string().required(),
  DOMAIN: Joi.string().domain().required(),
  JWT_ACCESS_TIME: Joi.number().required(),
  JWT_CONFIRMATION_SECRET: Joi.string().required(),
  JWT_CONFIRMATION_TIME: Joi.number().required(),
  JWT_RESET_PASSWORD_SECRET: Joi.string().required(),
  JWT_RESET_PASSWORD_TIME: Joi.number().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_TIME: Joi.number().required(),
});
