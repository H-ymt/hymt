export type Slug = string & { readonly __brand: "Slug" };
export type ISODateString = string & { readonly __brand: "ISODateString" };
export type Tag = string & { readonly __brand: "Tag" };

export interface KnowledgeEntry {
  readonly id: string;
  readonly source: "gist" | "zenn";
  readonly slug: Slug;
  readonly title: string;
  readonly summary: string;
  readonly url: string;
  readonly tags: ReadonlyArray<Tag>;
  readonly publishedAt: ISODateString;
  readonly updatedAt?: ISODateString;
  readonly contentHtml?: string;
  readonly author?: string;
  readonly image?: string;
}

