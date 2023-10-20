import { ObjectId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";
import { formToJSON } from "~/utils/form-helper.server";

const CERTIFICATIONS_COLLECTION = "certifications";

export const getCertification = async (id: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _mail = await _db.collection(CERTIFICATIONS_COLLECTION).findOne({
    _id: new ObjectId(id),
  });

  return { ok: true, mail: _mail };
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
  images: string;
};

export const createCertification = async (mailInfo: CertificationInfo) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    const _mail = await _db.collection(CERTIFICATIONS_COLLECTION).insertOne({
      ...mailInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ok: true, id: _mail.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to add new mail" };
  }
};

export const updateCertification = async (
  mailId: string,
  mailInfo: FormData
) => {
  const mailSchema = z.object({
    subject: z.string().min(1, "Subject must not be empty."),
    name: z.string().min(1, "Name must not be empty."),
    email: z.string().min(1, "Name must not be empty.").email(),
    phone: z.string().min(1, "Phone must not be empty."),
    message: z.string().min(1, "Message must not be empty."),
  });

  // validate form data
  const _validation = mailSchema.safeParse(formToJSON(mailInfo));
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

  if (_validation.data.subject !== undefined) {
    updatedRecord.subject = _validation.data.subject;
  }

  if (_validation.data.name !== undefined) {
    updatedRecord.name = _validation.data.name;
  }

  if (_validation.data.email !== undefined) {
    updatedRecord.email = _validation.data.email;
  }

  if (_validation.data.phone !== undefined) {
    updatedRecord.phone = _validation.data.phone;
  }

  if (_validation.data.message !== undefined) {
    updatedRecord.message = _validation.data.message;
  }

  try {
    const updateQuery = await _db
      .collection(CERTIFICATIONS_COLLECTION)
      .updateOne({ _id: new ObjectId(mailId) }, { $set: updatedRecord });

    if (updateQuery.matchedCount === 0) {
      return { error: "No mail found with that id." };
    }
    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to update that mail." };
  }
};

export const deleteCertification = async (mailId: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    const deleteQuery = await _db
      .collection(CERTIFICATIONS_COLLECTION)
      .deleteOne({ _id: new ObjectId(mailId) });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        error: `Unable to delete mail`,
      };
    }
    return {
      ok: true,
      message: `Certification [id: ${mailId.toString()}] deleted.`,
    };
  } catch (error) {
    log.e(error);
    return {
      ok: false,
      error: `Unable to delete that mail.`,
    };
  }
};
