import type { ObjectId } from "mongodb";
import { client } from "~/lib/db.server";

const PRODUCTS_COLLECTION = "sections";

export const getSection = async (id: ObjectId) => {
  const _db = await client.db(process.env.MOBAZZAR_NS);
  // find user by email
  const _section = await _db.collection(PRODUCTS_COLLECTION).findOne({
    _id: id,
  });
  // return user
  return { ok: true, section: _section };
};

export const getAllSections = async () => {
  const _db = await client.db(process.env.MOBAZZAR_NS);
  // find user by email
  const _sections = await _db
    .collection(PRODUCTS_COLLECTION)
    .find({})
    .toArray();
  // return user
  return { ok: true, sections: _sections };
};
