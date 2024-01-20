import { User } from "../../models/user";

export const register = async (req, res) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      throw new Error("Email exists");
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save(session);

    await session.commitTransaction();
    await session.endSession();

    return res.formatter.created("create accout success");
  } catch (e) {
    await session.abortTransaction();
    await session.endSession();
    return res.formatter.unprocess(e.message || e);
  }
};

export const validationLogin = async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findOne({ email: username });

  if (user) {
    return next();
  }
  return res.formatter.unprocess(
    "Thông tin đăng nhập không đúng, vui lòng thử lại"
  );
};
