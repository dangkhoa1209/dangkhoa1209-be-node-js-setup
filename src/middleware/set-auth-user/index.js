// có thể custom thêm headers và đọc db đễ gán thêm data nếu cần

const setAuthUser = async (req, res, next) => {
  res.user = res.locals.oauth.token && res.locals.oauth.token.user;
  // const workspaceId = req.headers['']

  if (res.user) {
    req.user = res.user;
    return next();
  }
  return res.formatter.forbidden();
};

export default setAuthUser;
