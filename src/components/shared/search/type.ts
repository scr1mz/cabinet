import { Record } from "immutable";

export type SearchType = {
  placeholder: string;
  title: string;
};

export type SearchTypes = Record<string, SearchType>;
