import * as AuthRepo from "../../modules/auth";

export const register = async (req, res) => AuthRepo.register(req, res);

export const validationLogin = async (req, res, next) =>
  AuthRepo.validationLogin(req, res, next);
