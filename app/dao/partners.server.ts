import { ObjectId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";

const PARTNERS_COLLECTION = "partners";

export type Partner = {
  name: string;
  image: string;
};

const partnerCreateSchema = z.object({
  name: z.string().min(1, "Name must not be empty."),
  image: z.string(),
});

const partnerUpdateSchema = z.object({
  name: z.string().min(1, "Name must not be empty."),
  image: z.string().nullable(),
});

export const getPartner = async (id: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _partner = await _db.collection(PARTNERS_COLLECTION).findOne({
    _id: new ObjectId(id),
  });

  return { ok: true, partner: _partner };
};

export const getAllPartners = async () => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _partners = await _db
    .collection(PARTNERS_COLLECTION)
    .find({})
    .sort({ name: 1, updatedAt: -1 })
    .toArray();

  return { ok: true, partners: _partners };
};

export const createPartner = async (data: any) => {
  // validate form data
  const _validation = partnerCreateSchema.safeParse(data);
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
    const _partner = await _db.collection(PARTNERS_COLLECTION).insertOne({
      ..._validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ok: true, id: _partner.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to add new partner" };
  }
};

export const updatePartner = async (partnerId: string, data: any) => {
  // validate form data
  const _validation = partnerUpdateSchema.safeParse(data);
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

  if (typeof _validation.data.image === "string") {
    updatedRecord.image = _validation.data.image;
  }

  try {
    const updateQuery = await _db
      .collection(PARTNERS_COLLECTION)
      .updateOne(
        { _id: new ObjectId(partnerId) },
        { $set: { ...updatedRecord, updatedAt: new Date() } },
      );

    if (updateQuery.matchedCount === 0) {
      return { error: "No partner found with that id." };
    }
    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to update that partner." };
  }
};

export const deletePartner = async (partnerId: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    const deleteQuery = await _db
      .collection(PARTNERS_COLLECTION)
      .deleteOne({ _id: new ObjectId(partnerId) });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        error: `Unable to delete partner`,
      };
    }
    return {
      ok: true,
      message: `Partner [id: ${partnerId.toString()}] deleted.`,
    };
  } catch (error) {
    log.e(error);
    return {
      ok: false,
      error: `Unable to delete that partner.`,
    };
  }
};
