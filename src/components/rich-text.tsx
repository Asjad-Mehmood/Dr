import { RichText as LexicalRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export function RichText({
  data,
  className = "",
}: {
  data?: unknown;
  className?: string;
}) {
  const state = data as SerializedEditorState | null | undefined;
  const hasContent = state?.root?.children?.some(
    (node) =>
      !("children" in node) ||
      (Array.isArray(node.children) && node.children.length > 0),
  );
  if (!hasContent) return null;
  return (
    <LexicalRichText
      data={state!}
      className={`prose max-w-none ${className}`}
    />
  );
}
