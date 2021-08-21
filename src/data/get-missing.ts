import { State } from "../types/core";
import { missingFilter } from "../utils/common";
import { collectionComparer, fieldComparer, permissionComparer, presetComparer, relationComparer } from "./comparers";

export const getMissing = (state1: State["data"], state2: State["data"]): State["data"] => {
  return {
    collections: state1.collections.filter(missingFilter(state2.collections, collectionComparer)),
    fields: state1.fields.filter(missingFilter(state2.fields, fieldComparer)),
    permissions: state1.permissions.filter(missingFilter(state2.permissions, permissionComparer)),
    presets: state1.presets.filter(missingFilter(state2.presets, presetComparer)),
    relations: state1.relations.filter(missingFilter(state2.relations, relationComparer)),
  };
};
