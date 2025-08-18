import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  HomeIcon,
  ComposeIcon,
  TagIcon,
  UserIcon,
} from "@sanity/icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // ——— Singletons ———
      S.listItem()
        .title("App Settings")
        .icon(CogIcon)
        .child(
          S.document().schemaType("appSettings").documentId("appSettings")
        ),

      S.listItem()
        .title("Home")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage")),

      S.divider(),

      // ——— Blog group ———
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("post").title("Posts").icon(ComposeIcon),
              S.documentTypeListItem("category")
                .title("Categories")
                .icon(TagIcon),
              S.documentTypeListItem("author").title("Authors").icon(UserIcon),
            ])
        ),

      S.divider(),

      // ——— Everything else (exclude surfaced types) ———
      ...S.documentTypeListItems().filter(
        (item) =>
          !["appSettings", "homePage", "post", "category", "author"].includes(
            item.getId() || ""
          )
      ),
    ]);
