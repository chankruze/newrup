import { ObjectId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { log } from "~/lib/logger.server";

const CAROUSELS_COLLECTION = "carousels";

const carouselSchema = z.object({
  name: z.string().min(1, "Name must not be empty."),
  description: z.string().min(1, "Description must not be empty."),
  images: z.array(z.string()),
});

export const getCarousel = async (id: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _carousel = await _db.collection(CAROUSELS_COLLECTION).findOne({
    _id: new ObjectId(id),
  });

  return { ok: true, carousel: _carousel };
};

export const getAllCarousels = async () => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const _carousels = await _db
    .collection(CAROUSELS_COLLECTION)
    .find({})
    .sort({ name: 1 })
    .toArray();

  return { ok: true, carousels: _carousels };
};

export type CarouselInfo = {
  name: string;
  description: string;
  images: string[];
  shuffle: boolean;
};

export const createCarousel = async (data: CarouselInfo) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  // validate form data
  const _validation = carouselSchema.safeParse(data);
  // send error data in response
  if (!_validation.success) {
    const errors = _validation.error.flatten();
    // return validation errors
    return {
      ok: false,
      error: errors,
    };
  }

  console.log({
    validation: _validation.data,
  });

  try {
    const _carousel = await _db.collection(CAROUSELS_COLLECTION).insertOne({
      ..._validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ok: true, id: _carousel.insertedId };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to add new carousel" };
  }
};

export const updateCarousel = async (
  carouselId: string,
  data: CarouselInfo
) => {
  // validate form data
  const _validation = carouselSchema.safeParse(data);
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

  // get old record by carouselId
  const { carousel } = await getCarousel(carouselId);

  if (!carousel) return { ok: false, error: "No carousel found with that id." };

  // Create an empty update operation
  const updatedRecord: Record<string, string | string[]> = {};

  if (_validation.data.name !== undefined) {
    updatedRecord.name = _validation.data.name;
  }

  if (_validation.data.description !== undefined) {
    updatedRecord.description = _validation.data.description;
  }

  if (_validation.data.images.length) {
    updatedRecord.images = [...carousel.images, ..._validation.data.images];
  }

  try {
    const updateQuery = await _db
      .collection(CAROUSELS_COLLECTION)
      .updateOne(
        { _id: new ObjectId(carouselId) },
        { $set: { ...updatedRecord, updatedAt: new Date() } }
      );

    if (updateQuery.matchedCount === 0) {
      return { ok: false, error: "No carousel found with that id." };
    }
    return { ok: true };
  } catch (error) {
    log.e(error);
    return { ok: false, error: "Unable to update that carousel." };
  }
};

export const deleteCarousel = async (carouselId: string) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  try {
    const deleteQuery = await _db
      .collection(CAROUSELS_COLLECTION)
      .deleteOne({ _id: new ObjectId(carouselId) });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        error: `Unable to delete carousel`,
      };
    }
    return {
      ok: true,
      message: `Carousel [id: ${carouselId.toString()}] deleted.`,
    };
  } catch (error) {
    log.e(error);
    return {
      ok: false,
      error: `Unable to delete that carousel.`,
    };
  }
};
