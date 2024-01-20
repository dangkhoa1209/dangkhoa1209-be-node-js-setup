import multer from "multer";

const upload = multer();

export function parse(req, res, next) {
  if (req.parsed) {
    next();
    return;
  }

  const files = req.files;
  let file;
  if (Array.isArray(files) && files?.length === 1) {
    file = files[0];
  } else if (typeof files === "object" && Object.keys(files).length === 1) {
    file = files[Object.keys(files)[0]] || undefined;
  }
  Object.assign(req, {
    file,
    parsed: true,
  });
  next();
}

export default [upload.any(), parse];
