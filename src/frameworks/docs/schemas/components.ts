export const apiKeyAuthSchema = {
  type: "apiKey",
  in: "header",
  name: "x-access-token"
};

export const notFound = {
  description: "Resource not found"
};

export const badRequest = {
  description: "Invalid request",
  content: {
    "application/json": {
      schema: {
        $ref: "#/schemas/error"
      }
    }
  }
};

export const forbidden = {
  description: "Forbidden access",
  content: {
    "application/json": {
      schema: {
        $ref: "#/schemas/error"
      }
    }
  }
};

export const serverError = {
  description: "Internal error server",
  content: {
    "application/json": {
      schema: {
        $ref: "#/schemas/error"
      }
    }
  }
};

export const unauthorized = {
  description: "Invalid credentials",
  content: {
    "application/json": {
      schema: {
        $ref: "#/schemas/error"
      }
    }
  }
};

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden
};
