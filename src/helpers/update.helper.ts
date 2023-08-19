/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IGenericMongoDBDocument } from "../interfaces/document.interface";

const updateDocument = async <T extends object>(
  result: IGenericMongoDBDocument<T>,
  payload: Partial<T>
) => {
  if (Object.keys(payload).length > 0) {
    Object.keys(payload).forEach((key) => {
      if (key in result) {
        (result as any)[key] = payload[key as keyof typeof payload];
      }
    });
  }

  // if (nestedObjects && Object.keys(nestedObjects)?.length > 0) {
  //   Object.entries(nestedObjects).forEach(([key, value]) => {
  //     if (value && Object.keys(value)?.length > 0) {
  //       Object.keys(value).forEach((key2) => {
  //         (result as any)[key][key2] = value[key2 as keyof typeof value];
  //       });
  //     }
  //   });
  // }

  const updatedDocument = await result.save();
  return { updatedDocument };
};

export const UpdateHelper = {
  updateDocument,
};
