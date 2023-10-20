import { ObjectId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";
import { formToJSON } from "~/utils/form-helper.server";

const CERTIFICATIONS_COLLECTION = "certifications";

const certificationSchema = z.object({
  name: z.string().min(1, "Name must not be empty."),
  description: z.string().min(1, "Description must not be empty."),
  image: z.any().nullable(),
  link: z.string().min(1, "Link must not be empty."),
});

export const getCertification = async (id: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _certification = await _db
    .collection(CERTIFICATIONS_COLLECTION)
    .findOne({
      _id: new ObjectId(id),
    });

  return { ok: true, certification: _certification };
};

export const getAllCertifications = async () => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _certifications = await _db
    .collection(CERTIFICATIONS_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return { ok: true, certifications: _certifications };
};

export type CertificationInfo = {
  name: string;
  description: string;
  thumbnail: string;
  link: string;
};

export const createCertification = async (formData: FormData) => {
  // validate form data
  const _validation = certificationSchema.safeParse(formToJSON(formData));
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
    const _certification = await _db
      .collection(CERTIFICATIONS_COLLECTION)
      .insertOne({
        ..._validation.data,
        thumbnail: _validation.data.image,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    return { ok: true, id: _certification.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to add new certification" };
  }
};

export const updateCertification = async (
  certificationId: string,
  formData: FormData
) => {
  // validate form data
  const _validation = certificationSchema.safeParse(formToJSON(formData));
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

  if (_validation.data.description !== undefined) {
    updatedRecord.description = _validation.data.description;
  }

  if (typeof _validation.data.image === "string") {
    updatedRecord.thumbnail = _validation.data.image;
  }

  if (_validation.data.link !== undefined) {
    updatedRecord.link = _validation.data.link;
  }

  try {
    const updateQuery = await _db
      .collection(CERTIFICATIONS_COLLECTION)
      .updateOne(
        { _id: new ObjectId(certificationId) },
        { $set: updatedRecord }
      );

    if (updateQuery.matchedCount === 0) {
      return { error: "No certification found with that id." };
    }
    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to update that certification." };
  }
};

export const deleteCertification = async (certificationId: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    const deleteQuery = await _db
      .collection(CERTIFICATIONS_COLLECTION)
      .deleteOne({ _id: new ObjectId(certificationId) });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        error: `Unable to delete certification`,
      };
    }
    return {
      ok: true,
      message: `Certification [id: ${certificationId.toString()}] deleted.`,
    };
  } catch (error) {
    log.e(error);
    return {
      ok: false,
      error: `Unable to delete that certification.`,
    };
  }
};
