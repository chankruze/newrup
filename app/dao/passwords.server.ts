import bcrypt from "bcryptjs";
import type { ObjectId } from "mongodb";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";

const PASSWORDS_COLLECTION = "passwords";

export const getPassword = async (id: ObjectId) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  return await _db.collection(PASSWORDS_COLLECTION).findOne({
    _id: id,
  });
};

export const getPasswordUserId = async (userId: ObjectId) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  return await _db.collection(PASSWORDS_COLLECTION).findOne({
    userId,
  });
};

export const addPassword = async (userId: ObjectId, password: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  // hash the password
  const hash = await bcrypt.hash(password, 12);

  try {
    // Insert the hashed password into the "passwords" collection
    const result = await _db.collection("passwords").insertOne({
      hash,
      userId,
      expired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { ok: true, id: result.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, id: null, error: "Unable to create a password" };
  }
};
