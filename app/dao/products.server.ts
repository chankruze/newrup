import { ObjectId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";
import { formToJSON } from "~/utils/form-helper.server";

const PRODUCTS_COLLECTION = "products";

const productSchema = z.object({
  title: z.string().min(1, "Title must not be empty."),
  description: z.string().min(1, "Description must not be empty."),
  image: z.any().nullable(),
  video: z.string().min(1, "Video link must not be empty."),
});

export const getProduct = async (id: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _product = await _db.collection(PRODUCTS_COLLECTION).findOne({
    _id: new ObjectId(id),
  });

  return { ok: true, product: _product };
};

export const getAllProducts = async () => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    const _sections = await _db
      .collection(PRODUCTS_COLLECTION)
      .find({})
      .sort({ name: 1, updatedAt: -1 })
      .toArray();

    return { ok: true, products: _sections };
  } catch (error) {
    return { ok: false, error };
  }
};

export const createProduct = async (productInfo: FormData) => {
  // validate form data
  const _validation = productSchema.safeParse(formToJSON(productInfo));
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
    const _product = await _db.collection(PRODUCTS_COLLECTION).insertOne({
      ..._validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ok: true, id: _product.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to add new product" };
  }
};

export const updateProduct = async (
  productId: string,
  productInfo: FormData,
) => {
  // validate form data
  const _validation = productSchema.safeParse(formToJSON(productInfo));
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

  if (_validation.data.video !== undefined) {
    updatedRecord.video = _validation.data.video;
  }

  if (typeof _validation.data.image === "string") {
    updatedRecord.image = _validation.data.image;
  }

  if (_validation.data.description !== undefined) {
    updatedRecord.description = _validation.data.description;
  }

  try {
    const updateQuery = await _db
      .collection(PRODUCTS_COLLECTION)
      .updateOne(
        { _id: new ObjectId(productId) },
        { $set: { ...updatedRecord, updatedAt: new Date() } },
      );

    if (updateQuery.matchedCount === 0) {
      return { error: "No product found with that id." };
    }
    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to update that product." };
  }
};

export const deleteProduct = async (productId: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    const deleteQuery = await _db
      .collection(PRODUCTS_COLLECTION)
      .deleteOne({ _id: new ObjectId(productId) });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        error: `Unable to delete product`,
      };
    }
    return {
      ok: true,
      message: `Product [id: ${productId.toString()}] deleted.`,
    };
  } catch (error) {
    log.e(error);
    return {
      ok: false,
      error: `Unable to delete that product.`,
    };
  }
};
