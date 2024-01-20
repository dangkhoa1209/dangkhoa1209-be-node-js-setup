// | 'ok'
// | 'created'
// | 'accepted'
// | 'noContent'
// | 'badRequest'
// | 'unauthorized'
// | 'forbidden'
// | 'notFound'
// | 'methodNotAllowed'
// | 'timeout'
// | 'conflict'
// | 'unprocess'
// | 'tooManyRequests'
// | 'serverError'
// | 'badGateway'
// | 'serviceUnavailable'
// | 'gatewayTimeout'

const methods = [
  // lấy dữ liệu thành công
  {
    name: "ok",
    code: 200,
    message: "OK",
    isSuccess: true,
  },
  // tạo
  {
    name: "created",
    code: 201,
    message: "Created",
    isSuccess: true,
  },
  // đã nhận đc những chưa xử lý (xử lý nền)
  {
    name: "accepted",
    code: 202,
    message: "Accepted",
    isSuccess: true,
  },
  // không có dử liệu trả về
  {
    name: "noContent",
    code: 204,
    message: "No Content",
    isSuccess: true,
  },
  //  thông tin không hợp lệ (thiếu / sai tham số)
  {
    name: "badRequest",
    code: 400,
    message: "Bad Request",
    isSuccess: false,
  },
  // thông tin xác thực không hợp lệ
  {
    name: "unauthorized",
    code: 401,
    message: "Unauthorized",
    isSuccess: false,
  },
  // ko có quyền
  {
    name: "forbidden",
    code: 403,
    message: "Access denied",
    isSuccess: false,
  },
  // không tìm thấy route
  {
    name: "notFound",
    code: 404,
    message: "Not Found",
    isSuccess: false,
  },

  {
    name: "methodNotAllowed",
    code: 405,
    message: "Method Not Allowed",
    isSuccess: false,
  },
  {
    name: "timeout",
    code: 408,
    message: "Request timeout",
    isSuccess: false,
  },
  // sung đột dữ liệu
  {
    name: "conflict",
    code: 409,
    message: "Conflict",
    isSuccess: false,
  },
  {
    name: "unprocess",
    code: 422,
    message: "Unprocessable Entity",
    isSuccess: false,
  },
  {
    name: "tooManyRequests",
    code: 429,
    message: "Too Many Requests",
    isSuccess: false,
  },
  // lỗi code
  {
    name: "serverError",
    code: 500,
    message: "Internal Server Error",
    isSuccess: false,
  },
  {
    name: "badGateway",
    code: 502,
    message: "Bad Gateway",
    isSuccess: false,
  },
  {
    name: "serviceUnavailable",
    code: 503,
    message: "Service Unavailable",
    isSuccess: false,
  },
  {
    name: "gatewayTimeout",
    code: 504,
    message: "Gateway Timeout",
    isSuccess: false,
  },
];

export default methods;
