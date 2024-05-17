const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");


const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return User.create({ ...userBody });
};


const queryUsers = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;

  const sort = {};
  if (sortBy) {
    const [sortField, sortOrder] = sortBy.split(':');
    sort[sortField] = sortOrder === 'desc' ? -1 : 1;
  }

  const users = await User.paginate(filter, {
    sort,
    limit,
    page,
  });

  return users;
};


const getUserById = async (id) => {
  return User.findById(id);
};


const getUserByEmail = async (email) => {
  return User.findOne({ email });
};




const updateProfileById = async (id, updateBody) => {
  const user = await getUserById(id);
  // eslint-disable-next-line no-console
  console.log(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateProfileById,
};
