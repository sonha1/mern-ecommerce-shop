const sendToken = (user, statusCode, res) => {
  const accessToken = user.getJwtToken();
  const refreshToken = user.getJwtRefreshToken();

  const options = {
    expires: new Date(
      Date.now() +
        process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
    path: '/',
    sameSite: 'strict',
  };
  const options1 = {
    expires: new Date(
      Date.now() +
        process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
    secure: false,
    path: '/',
  };
  const { password, ...others } = user._doc;
  res
    .status(statusCode)
    .cookie('accessToken', accessToken, options1)
    .cookie('refreshToken', refreshToken, options)
    .json({ message: 'success', ...others, accessToken });
};
export default sendToken;
