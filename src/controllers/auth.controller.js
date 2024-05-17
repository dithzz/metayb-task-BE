const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
} = require("../services");
const ApiError = require("../utils/ApiError");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if(user && !user.isApproved){
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Employer is not Activated')
  }
  const tokens = await tokenService.generateAuthTokens(user);

  await user.recordLogin()
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  // eslint-disable-next-line no-console
  const user = await userService.getUserById(req.body.user.id);
  await authService.logout(req.body.refreshToken);

  await user.recordLogout()
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});


module.exports = {
  register,
  login,
  logout,
  refreshTokens,
};
