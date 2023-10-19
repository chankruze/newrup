import { ObjectId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";
import { formToJSON } from "~/utils/form-helper.server";

const TESTIMONIALS_COLLECTION = "testimonials";

export const getTestimony = async (id: string) => {
  const _db = await client.db(process.env.MOBAZZAR_NS);
  // find user by email
  const _testimony = await _db.collection(TESTIMONIALS_COLLECTION).findOne({
    _id: new ObjectId(id),
  });
  // return user
  return { ok: true, testimony: _testimony };
};

export const getAllTestimonials = async () => {
  const _db = await client.db(process.env.MOBAZZAR_NS);
  // find user by email
  const _sections = await _db
    .collection(TESTIMONIALS_COLLECTION)
    .find({})
    .sort({ name: 1, updatedAt: -1 })
    .toArray();
  // return user
  return { ok: true, testimonials: _sections };
};

export const createTestimony = async (testimonyInfo: FormData) => {
  const sectionSchema = z.object({
    name: z.string().min(1, "Name must not be empty."),
    content: z.string().min(1, "Content must not be empty."),
    image: z.any(),
    position: z.string().min(1, "Position must not be empty."),
  });

  // validate form data
  const _validation = sectionSchema.safeParse(formToJSON(testimonyInfo));
  // send error data in response
  if (!_validation.success) {
    const errors = _validation.error.flatten();
    // return validation errors
    return {
      ok: false,
      error: errors,
    };
  }

  const _db = await client.db(process.env.MOBAZZAR_NS);

  try {
    const _testimony = await _db.collection(TESTIMONIALS_COLLECTION).insertOne({
      ..._validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ok: true, id: _testimony.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to add new testimony" };
  }
};

export const updateTestimony = async (
  testimonyId: string,
  testimonyInfo: FormData
) => {
  const sectionSchema = z.object({
    name: z.string().min(1, "Name must not be empty."),
    content: z.string().min(1, "Content must not be empty."),
    image: z.any().nullable(),
    position: z.string().min(1, "Position must not be empty."),
  });

  // validate form data
  const _validation = sectionSchema.safeParse(formToJSON(testimonyInfo));
  // send error data in response
  if (!_validation.success) {
    const errors = _validation.error.flatten();
    // return validation errors
    return {
      ok: false,
      error: errors,
    };
  }

  const _db = await client.db(process.env.MOBAZZAR_NS);

  // Create an empty update operation
  const updatedRecord: Record<string, string> = {};

  if (_validation.data.name !== undefined) {
    updatedRecord.name = _validation.data.name;
  }

  if (_validation.data.position !== undefined) {
    updatedRecord.position = _validation.data.position;
  }

  if (typeof _validation.data.image === "string") {
    updatedRecord.image = _validation.data.image;
  }

  if (_validation.data.content !== undefined) {
    updatedRecord.content = _validation.data.content;
  }

  try {
    const updateQuery = await _db
      .collection(TESTIMONIALS_COLLECTION)
      .updateOne({ _id: new ObjectId(testimonyId) }, { $set: updatedRecord });

    if (updateQuery.matchedCount === 0) {
      return { error: "No testimony found with that id." };
    }
    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to update that testimony." };
  }
};

export const deleteTestimony = async (testimonyId: string) => {
  const _db = await client.db(process.env.MOBAZZAR_NS);

  try {
    const deleteQuery = await _db
      .collection(TESTIMONIALS_COLLECTION)
      .deleteOne({ _id: new ObjectId(testimonyId) });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        error: `Unable to delete testimony`,
      };
    }
    return {
      ok: true,
      message: `Testimony [id: ${testimonyId.toString()}] deleted.`,
    };
  } catch (error) {
    log.e(error);
    return {
      ok: false,
      error: `Unable to delete that testimony.`,
    };
  }
};
