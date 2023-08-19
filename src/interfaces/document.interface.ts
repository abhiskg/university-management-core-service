import type { Document, Types } from "mongoose";

export type IGenericMongoDBDocument<T> = Document<
  unknown,
  Record<string, unknown>,
  T
> &
  Omit<
    T & {
      _id: Types.ObjectId;
    },
    never
  >;
