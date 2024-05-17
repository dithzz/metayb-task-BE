const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { jobService } = require("../services");

const createJob = catchAsync(async (req, res) => {
  const user = await jobService.createJob(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getJobs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.select = "jobName description eta createdAt"; // Add createdAt to the selected fields
  const result = await jobService.queryJobs(filter, options);
  res.send(result);
});


const getJob = catchAsync(async (req, res) => {
  const job = await jobService.getJobById(req.job.id);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }
  res.send(job);
});

module.exports = { createJob, getJobs, getJob };
