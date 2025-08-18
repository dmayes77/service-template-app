// src/sanity/structure.ts
import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("App Settings")
        .icon(CogIcon)
        .child(
          S.document().schemaType("appSettings").documentId("appSettings")
        ),
      S.listItem()
        .title("Home")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("mediaImage").title("Media / Images"),
      S.divider(),
      // everything else
      ...S.documentTypeListItems().filter(
        (i) =>
          !["appSettings", "homePage", "service", "mediaImage"].includes(
            i.getId() || ""
          )
      ),
    ]);
