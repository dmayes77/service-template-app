import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import  appSettings  from "./appSettings";
import { homePage } from "./homePage";
import {services} from "./services";
import hoursEntry from "./objects/hoursEntry";
import servicePackage from "./servicePackage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    appSettings,
    homePage,
    services,

    hoursEntry,
    servicePackage,
  ],
};
