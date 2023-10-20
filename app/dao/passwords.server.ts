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

export const getPasswordByUserId = async (userId: ObjectId) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  return await _db.collection(PASSWORDS_COLLECTION).findOne({
    userId,
    expired: false,
  });
};

export const createPassword = async (userId: ObjectId, password: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  // hash the password
  const hash = await bcrypt.hash(password, 12);

  try {
    // Insert the hashed password into the "passwords" collection
    await _db.collection(PASSWORDS_COLLECTION).insertOne({
      hash,
      userId,
      expired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to create a password" };
  }
};

export const updatePassword = async (userId: ObjectId, password: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    // invalidate all old passwords
    await _db
      .collection(PASSWORDS_COLLECTION)
      .updateMany({ userId }, { $set: { expired: true } });

    // insert new pass
    await createPassword(userId, password);

    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to create a password" };
  }
};
