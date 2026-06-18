import type {
  JsonApiResponse,
  JsonApiNode,
  JsonApiImageResource,
  ContentItem,
} from '../types/jsonapi.js';

/**
 * Resolves an image URL from JSON:API included resources.
 * Handles both field_image (media) and direct file relationships.
 */
function resolveImageUrl(
  node: JsonApiNode,
  included: (JsonApiImageResource | JsonApiNode)[],
): { url: string | null; alt: string } {
  const imageRel =
    node.relationships?.field_image?.data ??
    node.relationships?.field_media_image?.data;

  if (!imageRel || Array.isArray(imageRel)) {
    return { url: null, alt: '' };
  }

  const resource = included.find(
    (r) => r.id === imageRel.id && r.type === imageRel.type,
  );

  if (!resource) return { url: null, alt: '' };

  // Direct file--file resource
  if (resource.type === 'file--file') {
    const file = resource as JsonApiImageResource;
    return {
      url: file.attributes.uri.url,
      alt: file.attributes.alt,
    };
  }

  // Media entity — recurse one level to find the actual file
  const mediaNode = resource as JsonApiNode;
  const fileRel =
    mediaNode.relationships?.field_media_image?.data ??
    mediaNode.relationships?.thumbnail?.data;

  if (!fileRel || Array.isArray(fileRel)) return { url: null, alt: '' };

  const fileResource = included.find(
    (r) => r.id === fileRel.id && r.type === 'file--file',
  ) as JsonApiImageResource | undefined;

  if (!fileResource) return { url: null, alt: '' };

  return {
    url: fileResource.attributes.uri.url,
    alt: fileResource.attributes.alt,
  };
}

/**
 * Normalises a raw JSON:API response into a flat array of ContentItem objects.
 * This is the only place in the codebase that knows about JSON:API shape.
 */
export function normaliseJsonApiResponse(
  response: JsonApiResponse,
  baseUrl = '',
): ContentItem[] {
  const included = response.included ?? [];

  return response.data.map((node): ContentItem => {
    const attrs = node.attributes;
    const { url: imageUrl, alt: imageAlt } = resolveImageUrl(node, included);

    const summary =
      attrs.field_summary ??
      attrs.body?.summary ??
      // Strip HTML from body value for a plain-text summary fallback
      attrs.body?.value?.replace(/<[^>]+>/g, '').slice(0, 200) ??
      '';

    const path = attrs.path?.alias ?? `/node/${node.id}`;
    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

    return {
      id: node.id,
      title: attrs.title,
      summary,
      imageUrl,
      imageAlt,
      url,
      created: new Date(attrs.created),
    };
  });
}
