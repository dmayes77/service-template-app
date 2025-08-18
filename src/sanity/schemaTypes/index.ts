import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import  appSettings  from "./appSettings";
import { homePage } from "./homePage";
import service  from "./services";
import mediaImage from "./mediaImage";
import hoursEntry from "./objects/hoursEntry";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    appSettings,
    homePage,
    service,
    mediaImage,
    hoursEntry,
  ],
};
