/**
 * Centralized Configuration logic for ElectIQ
 */
const Joi = require('joi');
const logger = require('../utils/logger');
const constants = require('../constants');

// Load environment variables
require('dotenv').config();

// Define validation schema
const envVarsSchema = Joi.object({
  PORT: Joi.number().default(8080),
  GEMINI_API_KEY: Joi.string().required().description('Gemini AI API Key'),
  MAPS_API_KEY: Joi.string().allow('').optional().default(''),
  FIREBASE_SERVICE_ACCOUNT: Joi.string().required().description('Firebase Service Account JSON string'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
  logger.error(`[CONFIG ERROR] Invalid environment variables: ${error.message}`);
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  port: envVars.PORT,
  geminiApiKey: envVars.GEMINI_API_KEY,
  mapsApiKey: envVars.MAPS_API_KEY,
  firebaseServiceAccount: envVars.FIREBASE_SERVICE_ACCOUNT,
  isProd: envVars.NODE_ENV === 'production',
  isTest: envVars.NODE_ENV === 'test',
  cacheMax: constants.CACHE_MAX_SIZE,
};

module.exports = config;
