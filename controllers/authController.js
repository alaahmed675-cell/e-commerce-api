const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    token: result.token,
    data: result.user,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  res.json({
    success: true,
    token: result.token,
    data: result.user,
  });
});

module.exports = { register, login };
