const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  // Add productionDate filter if provided
  if (req.query.productionDate) {
    const productionDate = new Date(req.query.productionDate);

    // Ensure productionDate is a valid date
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(productionDate.getTime())) {
      filter["dailyProduction.date"] = {
        $gte: new Date(productionDate.setHours(0, 0, 0, 0)),
        $lt: new Date(productionDate.setHours(23, 59, 59, 999)),
      };
    }
  }

  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});


const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body);
  res.send(user);
});

const updateUserProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfileById(req.params.id, req.body);
  res.send(user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserProfile,
};
