import dotenv from "dotenv";
dotenv.config();
import { mongoHelper } from "../src/dataproviders/db";
import { appConfig } from "../src/config";

// database collection will automatically be created if it does not exist
// indexes will only be added if they don't exist
mongoHelper.connect(appConfig.mongodb.url).then(async () => {
  console.log('Setting up database...');
  let result;
  result = await mongoHelper.getCollection("comments");
  result = await result.createIndexes([
    { key: { hash: 1 }, name: 'hash_idx' },
    { key: { postId: -1 }, name: 'postId_idx' },
    { key: { replyToId: -1 }, name: 'replyToId_idx' }
  ]);
  console.log(result);
  console.log('Database setup complete...');
  await mongoHelper.disconnect();
  process.exit();
}).catch(console.error);
