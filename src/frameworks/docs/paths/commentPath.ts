export const commentPath = {
  get: {
    tags: ["comment"],
    summary: "Get all comment with given post id",
    description: "API for get comments from one post",
    parameters: [
      {
        in: "query",
        name: "postId",
        required: true,
        description: "Id from a blog or wiki post",
        schema: {
          type: "string"
        }
      }
    ],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/listCommentsResponse"
            }
          }
        }
      },
      400: {
        $ref: "#/components/badRequest"
      },
      401: {
        $ref: "#/components/unauthorized"
      },
      404: {
        $ref: "#/components/notFound"
      },
      500: {
        $ref: "#/components/serverError"
      }
    }
  },
  post: {
    tags: ["comment"],
    summary: "Create a new comment",
    description: "API for add comments",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/addCommentParams"
          }
        }
      }
    },
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/addCommentResponse"
            }
          }
        }
      },
      400: {
        $ref: "#/components/badRequest"
      },
      401: {
        $ref: "#/components/unauthorized"
      },
      404: {
        $ref: "#/components/notFound"
      },
      500: {
        $ref: "#/components/serverError"
      }
    }
  }
};

export const commentIdPath = {
  patch: {
    tags: ["comment"],
    summary: "Update comment with given id",
    description: "API for update comments",
    requestBody: {
      description: "Comment edit params object",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/text"
          }
        }
      }
    },
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        description: "Comment with new values of properties",
        schema: {
          $ref: "#/schemas/id"
        }
      }
    ],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/deleteCommentResponse"
            }
          }
        }
      },
      400: {
        $ref: "#/components/badRequest"
      },
      401: {
        $ref: "#/components/unauthorized"
      },
      404: {
        $ref: "#/components/notFound"
      },
      500: {
        $ref: "#/components/serverError"
      }
    }
  },
  delete: {
    tags: ["comment"],
    summary: "Delete comment with given id",
    description: "API for delete comments",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        description: "Delete comment with id",
        schema: {
          $ref: "#/schemas/id"
        }
      }
    ],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/deleteCommentResponse"
            }
          }
        }
      },
      400: {
        $ref: "#/components/badRequest"
      },
      401: {
        $ref: "#/components/unauthorized"
      },
      404: {
        $ref: "#/components/notFound"
      },
      500: {
        $ref: "#/components/serverError"
      }
    }
  }
};
