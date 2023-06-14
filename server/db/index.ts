import { Polybase } from "@polybase/client";

const namespace = process.env.POLYBASE_NAMESPACE ?? "";

export const db = new Polybase({
  defaultNamespace: namespace,
});

export const usersCollection = db.collection<{
  id: string;
  imageHashes: string[];
}>("users");

export const getUser = async (address: string) => {
  return await usersCollection.record(address).get();
};

export const createUser = async (address: string, imageHashes: string[]) => {
  return await usersCollection.create([address, imageHashes]);
};
