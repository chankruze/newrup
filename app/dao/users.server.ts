import bcrypt from "bcryptjs";
import type { Document, WithId } from "mongodb";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";
import { addPassword, getPasswordUserId } from "./passwords.server";

const USERS_COLLECTION = "users";

export type UserInfo = {
  name: string;
  email: string;
  password: string;
};

export type User = WithId<Document> &
  UserInfo & {
    createdAt: Date;
    updatedAt: Date;
  };

export const getUser = async (email: string) => {
  const _db = await client.db(process.env.MOBAZZAR_NS);
  // find user by email
  const _user = await _db.collection(USERS_COLLECTION).findOne({
    email,
  });
  // return user
  return { ok: true, user: _user };
};

export const addUser = async (userInfo: UserInfo) => {
  const _db = await client.db(process.env.MOBAZZAR_NS);

  // create new user
  try {
    const _user = await _db.collection(USERS_COLLECTION).insertOne({
      email: userInfo.email,
      name: userInfo.name,
      role: "VIEWER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await addPassword(_user.insertedId, userInfo.password);
    // return user
    return { ok: true, id: _user.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to add new user" };
  }
};

export const loginUser = async (email: string, password: string) => {
  // check if the user exists in the db
  const { ok, user } = await getUser(email);
  // check if the user exists
  if (ok && user) {
    // fetch password form db
    const _password = await getPasswordUserId(user._id);

    if (_password) {
      const _isValid = await bcrypt.compare(password, _password.hash);

      // if password is invalid
      if (!_isValid) {
        return {
          ok: false,
          id: null,
          error: "Wrong password. Please try again",
        };
      }

      return { ok: true, id: user._id.toString() };
    }

    return { ok: false, error: "This user don't have a password" };
  }

  return { ok: false, id: null, error: `User ${email} does not exist` };
};

export const registerUser = async ({ name, email, password }: UserInfo) => {
  // check if the user exists in the db
  const { ok, user } = await getUser(email);

  if (ok && user) {
    return { ok: false, id: null, error: `User ${email} already exists` };
  }

  const newUser = await addUser({
    name,
    email,
    password,
  });

  // if user creation fails
  if (newUser.ok && newUser.id) {
    return {
      ok: true,
      id: newUser.id.toString(),
    };
  }

  return { ok: false, id: null, error: newUser.error };
};
