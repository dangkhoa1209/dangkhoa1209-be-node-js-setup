const fs = require("fs");

export * from "./router/index.js";
import OAuthModel, { validationLogin } from "./oauth/index.js";

const formatPath = (path, prefix) => {
  if (prefix) {
    if (prefix[0] !== "/") {
      prefix = `/${prefix}`;
    }
    if (prefix[prefix.length - 1] === "/") {
      prefix = prefix.substring(0, prefix.length - 1);
    }
    if (prefix) {
      path = prefix + path;
    }
  }
  if (path.match(/\[(.[^[^\]]*)\]/)) {
    return path.replaceAll(/\[(.[^[^\]]*)\]/g, ":$1");
  }
  return path;
};
const processRoutePath = async (app, basePath, options) => {
  const paramList = [];
  const folderList = [];
  const fileList = [];
  const prefix = options?.prefix || "";
  const path = options?.path || "";
  let middlewares = options?.middlewares;
  if (!middlewares && !Array.isArray(middlewares)) {
    middlewares = [middlewares];
  }

  const dirInfo = await fs.promises.readdir(`${basePath}/${path}`);

  await Promise.all(
    dirInfo.map(async (filename) => {
      const filepath =
        path === ""
          ? `${basePath}/${filename}`
          : `${basePath}/${path}/${filename}`;
      const stat = await fs.promises.stat(filepath);

      if (stat.isDirectory()) {
        if (filename.match(/\[(.[^[^\]]*)\]/)) {
          paramList.push({
            path: path === "" ? `${filename}` : `${path}/${filename}`,
          });
        } else {
          folderList.push({
            path: path === "" ? `${filename}` : `${path}/${filename}`,
          });
        }
      } else if (
        [".ts", ".js"].includes(filename.slice(filename.indexOf(".")))
      ) {
        fileList.push({
          router: path[0] === "/" ? path : `/${path}`,
          path: filepath,
          filename,
        });
      }
    })
  );
  /** LOAD dir without params(:id) first */
  await Promise.all(
    folderList.map(async (folder) => {
      await processRoutePath(app, basePath, {
        ...options,
        path: folder.path,
      });
    })
  );
  const indexList = [];
  fileList.forEach((file) => {
    let routerPath = file.router;
    /** LOAD file .ts|.js with filename is not "index" */
    if (!["index.ts", "index.js"].includes(file.filename)) {
      const fn = file.filename.split(".")[0];
      routerPath += `/${fn}`;
      const routes = require(file.path);
      const router = routes.default(app);
      const path = formatPath(routerPath, prefix);
      if (path === "/") {
        return;
      }
      app.use(path, middlewares, router);
    } else {
      indexList.push(file);
    }
  });
  /** LOAD dir with params(:id) */
  await Promise.all(
    paramList.map(async (folder) => {
      await processRoutePath(app, basePath, {
        ...options,
        path: folder.path,
      });
    })
  );
  /** LOAD file index.ts|index.js */
  indexList.forEach((file) => {
    const routes = require(file.path);
    const router = routes.default(app);
    const path = formatPath(file.router, prefix);

    if (!path) {
      return;
    }

    app.use(path, middlewares, router);
  });
};

export { processRoutePath, OAuthModel };
