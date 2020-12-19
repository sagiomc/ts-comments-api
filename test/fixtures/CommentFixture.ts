import * as faker from "faker";
import { CommentProps } from "../../src/domain/entities";
import { UniqueEntityID } from "../../src/shared/domain";


const idObject = new UniqueEntityID();

export const fakeCommentProperties = (overrides?): CommentProps => {
  const fakeProperties = {
    author: faker.name.findName(),
    id: idObject,
    postId: faker.random.uuid(),
    text: faker.lorem.sentence(),
    source: {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      referrer: faker.internet.url()
    }
  };

  return {
    ...fakeProperties,
    ...overrides
  };
};
