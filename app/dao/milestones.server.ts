import { ObjectId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";
import { formToJSON } from "~/utils/form-helper.server";

const MILESTONES_COLLECTION = "milestones";

const milestoneSchema = z.object({
  title: z.string().min(1, "Title must not be empty."),
  description: z.string().min(1, "Description must not be empty."),
  link: z.string().optional(),
  date: z.string().pipe(z.coerce.date()).optional(),
});

export const getMilestone = async (id: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _milestone = await _db.collection(MILESTONES_COLLECTION).findOne({
    _id: new ObjectId(id),
  });

  return { ok: true, milestone: _milestone };
};

export const getAllMilestones = async () => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _milestones = await _db
    .collection(MILESTONES_COLLECTION)
    .find({})
    .sort({ createdAt: -1, updatedAt: -1 })
    .toArray();

  return { ok: true, milestones: _milestones };
};

// export type MilestoneInfo = {
//   name: string;
//   description: string;
//   link: string;
//   date: string;
// };

export const createMilestone = async (formData: FormData) => {
  // validate form data
  const _validation = milestoneSchema.safeParse(formToJSON(formData));
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

  try {
    const _milestone = await _db.collection(MILESTONES_COLLECTION).insertOne({
      ..._validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ok: true, id: _milestone.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to add new milestone" };
  }
};

export const updateMilestone = async (
  milestoneId: string,
  formData: FormData,
) => {
  // validate form data
  const _validation = milestoneSchema.safeParse(formToJSON(formData));
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
  const updatedRecord: Record<string, string | Date> = {};

  if (_validation.data.title !== undefined) {
    updatedRecord.title = _validation.data.title;
  }

  if (_validation.data.description !== undefined) {
    updatedRecord.description = _validation.data.description;
  }

  if (_validation.data.link !== undefined) {
    updatedRecord.link = _validation.data.link;
  }

  if (_validation.data.date !== undefined) {
    updatedRecord.date = new Date(_validation.data.date);
  }

  try {
    const updateQuery = await _db
      .collection(MILESTONES_COLLECTION)
      .updateOne(
        { _id: new ObjectId(milestoneId) },
        { $set: { ...updatedRecord, updatedAt: new Date() } },
      );

    if (updateQuery.matchedCount === 0) {
      return { error: "No milestone found with that id." };
    }
    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to update that milestone." };
  }
};

export const deleteMilestone = async (milestoneId: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    const deleteQuery = await _db
      .collection(MILESTONES_COLLECTION)
      .deleteOne({ _id: new ObjectId(milestoneId) });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        error: `Unable to delete milestone`,
      };
    }
    return {
      ok: true,
      message: `Milestone [id: ${milestoneId.toString()}] deleted.`,
    };
  } catch (error) {
    log.e(error);
    return {
      ok: false,
      error: `Unable to delete that milestone.`,
    };
  }
};
