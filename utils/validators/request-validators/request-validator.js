/**
 * This file includes a function for validation of the incoming requests
 *
 * @param {Array} params array of parameters which have to include on the request
 * @param {Object} request incoming request
 * @returns boolean true if the request is validated and boolean false for invalidated requests
 */

const validateRequest = async (params, request) => {
  if (request == null) {
    return false;
  }

  if (typeof request != "object") {
    return false;
  }

  if (Object.keys(request).length !== params.length) {
    return false;
  }

  const keysAvailable = await params.every((key) =>
    request.hasOwnProperty(key)
  );

  if (!keysAvailable) {
    return false;
  }

  return true;
};

module.exports = validateRequest;
