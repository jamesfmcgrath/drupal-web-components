/**
 * Typed representation of a Drupal JSON:API response.
 * Covers the subset of the spec used by these components.
 */

export interface JsonApiLinks {
  self?: { href: string };
  next?: { href: string };
  prev?: { href: string };
}

export interface JsonApiResourceIdentifier {
  type: string;
  id: string;
}

export interface JsonApiRelationshipData {
  data: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null;
  links?: JsonApiLinks;
}

export interface JsonApiImageAttributes {
  uri: { url: string };
  alt: string;
  width: number;
  height: number;
  title?: string;
}

export interface JsonApiImageResource {
  type: 'file--file';
  id: string;
  attributes: JsonApiImageAttributes;
}

export interface JsonApiNodeAttributes {
  title: string;
  body?: {
    value: string;
    summary?: string;
    format: string;
  };
  field_summary?: string;
  path?: { alias: string | null };
  created: string;
  changed: string;
  status: boolean;
  [key: string]: unknown;
}

export interface JsonApiNodeRelationships {
  field_image?: JsonApiRelationshipData;
  field_media_image?: JsonApiRelationshipData;
  [key: string]: JsonApiRelationshipData | undefined;
}

export interface JsonApiNode {
  type: string;
  id: string;
  attributes: JsonApiNodeAttributes;
  relationships?: JsonApiNodeRelationships;
  links?: JsonApiLinks;
}

export interface JsonApiResponse<T = JsonApiNode> {
  data: T[];
  included?: (JsonApiImageResource | JsonApiNode)[];
  links?: JsonApiLinks;
  meta?: {
    count?: number;
    [key: string]: unknown;
  };
}

/** Normalised content item used internally by all components. */
export interface ContentItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  imageAlt: string;
  url: string;
  created: Date;
}
