const Joi = require("joi");


const addJob = {
    body: Joi.object().keys({
      jobName: Joi.string().required(),
      description: Joi.string().required(),
      eta: Joi.string().required(),
    }),
  };

  module.exports = {
    addJob
  };