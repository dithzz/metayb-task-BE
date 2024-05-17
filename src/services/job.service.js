const { Job } = require("../models");


const createJob = async (jobBody) => {
  return Job.create({ ...jobBody });
};


const queryJobs = async (filter, options) => {
  const jobs = await Job.paginate(filter, options);
  return jobs;
};

const getJobById = async (id) => {
  return Job.findById(id);
};

module.exports = {
  createJob,
  queryJobs,
  getJobById,
};
