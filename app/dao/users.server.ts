import bcrypt from "bcryptjs";
import { ObjectId, type Document, type WithId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";
import { formToJSON } from "~/utils/form-helper.server";
import {
  createPassword,
  getPasswordByUserId,
  updatePassword,
} from "./passwords.server";

const USERS_COLLECTION = "users";

export const userSchema = z.object({
  name: z.string().min(1, "Name must not be empty"),
  email: z.string().min(1, "Email must not be empty.").email(),
  password: z.string().min(8, "Password must be 8 characters long."),
  role: z.string().optional(),
});

export type UserInfo = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export type User = WithId<Document> &
  UserInfo & {
    createdAt: Date;
    updatedAt: Date;
  };

export const getUser = async (email: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);
  // find user by email
  const _user = await _db.collection(USERS_COLLECTION).findOne({
    email,
  });
  // return user
  return { ok: true, user: _user };
};

export const getUserById = async (userId: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);
  // find user by email
  const _user = await _db.collection(USERS_COLLECTION).findOne({
    _id: new ObjectId(userId),
  });
  // return user
  return { ok: true, user: _user };
};

export const getAllUsers = async (userId: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _user = await _db.collection(USERS_COLLECTION).findOne({
    _id: new ObjectId(userId),
  });

  if (_user) {
    if (_user.role === "ADMIN") {
      // exclude own userId
      const _users = await _db
        .collection(USERS_COLLECTION)
        .find({
          _id: { $ne: new ObjectId(userId) },
        })
        .sort({ name: 1 })
        .toArray();
      // return section
      return { ok: true, users: _users };
    }
  }

  return {
    ok: true,
    error: "You are not unauthorized to perform this action.",
  };
};

export const createUser = async (userInfo: UserInfo) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  // create new user
  try {
    const _user = await _db.collection(USERS_COLLECTION).insertOne({
      email: userInfo.email,
      name: userInfo.name,
      role: userInfo.role || "VIEWER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createPassword(_user.insertedId, userInfo.password);
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
    const _password = await getPasswordByUserId(user._id);

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

export const registerUser = async (formData: FormData) => {
  // validate form data
  const _validation = userSchema.safeParse(formToJSON(formData));
  // send error data in response
  if (!_validation.success) {
    const errors = _validation.error.flatten();
    // return validation errors
    return {
      ok: false,
      error: errors,
    };
  }

  const { name, email, password, role } = _validation.data;

  // check if the user exists in the db
  const { ok, user } = await getUser(email);

  if (ok && user) {
    return { ok: false, id: null, error: `User ${email} already exists` };
  }

  const newUser = await createUser({
    name,
    email,
    password,
    role,
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

export const updateUser = async (userId: string, formData: FormData) => {
  const userSchema = z.object({
    name: z.string().min(1, "Name must not be empty"),
    email: z.string().min(1, "Email must not be empty.").email(),
    password: z.string().optional(),
    role: z.string().optional(),
  });

  // validate form data
  const _validation = userSchema.safeParse(formToJSON(formData));
  // send error data in response
  if (!_validation.success) {
    const errors = _validation.error.flatten();
    // return validation errors
    return {
      ok: false,
      error: errors,
    };
  }

  const _db = await client.db(process.env.NEWRUP_DB);

  // Create an empty update operation
  const updatedRecord: Record<string, string> = {};

  if (_validation.data.name !== undefined) {
    updatedRecord.name = _validation.data.name;
  }

  if (_validation.data.email !== undefined) {
    updatedRecord.email = _validation.data.email;
  }

  if (_validation.data.role !== undefined) {
    updatedRecord.role = _validation.data.role;
  }

  try {
    const updateQuery = await _db
      .collection(USERS_COLLECTION)
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { ...updatedRecord, updatedAt: new Date() } }
      );

    if (updateQuery.matchedCount === 0) {
      return { error: "No user found with that id." };
    }

    // change password
    if (_validation.data.password) {
      // fetch password form db
      await updatePassword(new ObjectId(userId), _validation.data.password);
    }

    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to update that user." };
  }
};
