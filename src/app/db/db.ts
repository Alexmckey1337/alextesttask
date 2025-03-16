import { createRxDatabase, RxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { postsSchema } from "./postsSchema";

let dbInstance: RxDatabase | null = null;

export const initializeDB = async () => {
  if (dbInstance) return dbInstance.collections.postsCollection;
  dbInstance = await createRxDatabase({
    name: "postsDB",
    storage: getRxStorageDexie(),
  });

  const collections = await dbInstance.addCollections({
    postsCollection: { schema: postsSchema },
  });

  return collections.postsCollection;
};
