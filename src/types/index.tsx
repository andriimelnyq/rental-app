import { Dispatch, SetStateAction } from "react";

export type TRentalItem = {
  address: string,
  description: string,
  latLng: number[],
  id: string,
  imgUrl: string,
};

export enum TError {
  LOAD_RENT_ITEMS = "Неможливо завантажити всі оголошення. Спробуйте пізніше!",
  ADD_RENT_ITEMS = "Неможливо додати оголошення. Спробуйте пізніше!",
  NONE = "",
}

export type TState = {
  rentItems: TRentalItem[];
  loading: boolean;
  error: TError;
};

export type SetState = Dispatch<SetStateAction<TState>>;