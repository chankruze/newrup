import { ObjectId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";
import { formToJSON } from "~/utils/form-helper.server";

const SECTIONS_COLLECTION = "sections";

const sectionSchema = z.object({
  title: z.string().min(1, "Title must not be empty."),
  subtitle: z.string().optional(),
  image: z.any().nullable(),
  description: z.string().min(1, "Description must not be empty."),
});

export const getSection = async (id: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);
  // find section by id
  const _section = await _db.collection(SECTIONS_COLLECTION).findOne({
    _id: new ObjectId(id),
  });
  // return section
  return { ok: true, section: _section };
};

export const getAllSections = async () => {
  const _db = await client.db(process.env.NEWRUP_DB);
  // find section by email
  const _sections = await _db
    .collection(SECTIONS_COLLECTION)
    .find({})
    .sort({ title: 1 })
    .toArray();
  // return section
  return { ok: true, sections: _sections };
};

export type SectionInfo = {
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
};

export const createSection = async (sectionInfo: SectionInfo) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  // validate form data
  const _validation = sectionSchema.safeParse(sectionInfo);
  // send error data in response
  if (!_validation.success) {
    const errors = _validation.error.flatten();
    // return validation errors
    return {
      ok: false,
      error: errors,
    };
  }

  try {
    const _section = await _db.collection(SECTIONS_COLLECTION).insertOne({
      ..._validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ok: true, id: _section.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to add new section" };
  }
};

export const updateSection = async (
  sectionId: string,
  sectionInfo: FormData,
) => {
  // validate form data
  const _validation = sectionSchema.safeParse(formToJSON(sectionInfo));
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

  if (_validation.data.title !== undefined) {
    updatedRecord.title = _validation.data.title;
  }

  if (_validation.data.subtitle !== undefined) {
    updatedRecord.subtitle = _validation.data.subtitle;
  }

  if (typeof _validation.data.image === "string") {
    updatedRecord.image = _validation.data.image;
  }

  if (_validation.data.description !== undefined) {
    updatedRecord.description = _validation.data.description;
  }

  try {
    const updateQuery = await _db
      .collection(SECTIONS_COLLECTION)
      .updateOne(
        { _id: new ObjectId(sectionId) },
        { $set: { ...updatedRecord, updatedAt: new Date() } },
      );

    if (updateQuery.matchedCount === 0) {
      return { error: "No section found with that id." };
    }
    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to update that section." };
  }
};

export const deleteSection = async (sectionId: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    const deleteQuery = await _db
      .collection(SECTIONS_COLLECTION)
      .deleteOne({ _id: new ObjectId(sectionId) });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        error: `Unable to delete section`,
      };
    }
    return {
      ok: true,
      message: `Section [id: ${sectionId.toString()}] deleted.`,
    };
  } catch (error) {
    log.e(error);
    return {
      ok: false,
      error: `Unable to delete that section.`,
    };
  }
};
