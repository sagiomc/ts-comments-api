export const idSchema = {
  properties: {
    id: {
      type: "string"
    }
  }
};

export const textSchema = {
  type: "object",
  properties: {
    text: {
      type: "string"
    }
  }
};

export const addCommentParamsSchema = {
  type: "object",
  properties: {
    author: {
      type: "string"
    },
    postId: {
      type: "string"
    },
    text: {
      type: "string"
    },
    replyToId: {
      type: "string"
    }
  },
  required: ["author", "postId", "text"]
};

export const addCommentResponseSchema = {
  type: "object",
  properties: {
    id: {
      type: "string"
    },
    author: {
      type: "string"
    },
    text: {
      type: "string"
    },
    postId: {
      type: "string"
    },
    createdAt: {
      type: "string"
    },
    published: {
      type: "string"
    },
    hash: {
      type: "string"
    },
    lastModifiedAt: {
      type: "string"
    },
    replyToId: {
      type: "string"
    }
  },
  required: ["id", "author", "text", "postId", "createdAt", "lastModifiedAt", "published", "hash"]
};

export const deleteCommentResponseSchema = {
  type: "object",
  properties: {
    message: {
      type: "string"
    },
    deletedCount: {
      type: "string"
    },
    softDelete: {
      type: "string"
    }
  }
};

export const listCommentsResponseSchema = {
  type: "object",
  properties: {
    id: {
      type: "string"
    },
    author: {
      type: "string"
    },
    text: {
      type: "string"
    },
    postId: {
      type: "string"
    },
    createdAt: {
      type: "string"
    },
    published: {
      type: "string"
    },
    lastModifiedAt: {
      type: "string"
    },
    replyToId: {
      type: "string"
    },
    replies: {
      type: "object",
      additionalProperties: {
        $ref: "#/schemas/listCommentsResponse"
      }
    }
  },
  required: ["id", "author", "text", "postId", "createdAt", "lastModifiedAt", "published"]
};
