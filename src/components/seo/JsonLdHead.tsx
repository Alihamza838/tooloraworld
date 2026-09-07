import React from 'react';
import { GuideFrontmatter, Tool } from '../../types';

interface JsonLdHeadProps {
  guide?: GuideFrontmatter;
  activeTool?: Tool | null;
  activeCategory?: string;
  customTitle?: string;
  customDescription?: string;
  canonicalPath?: string;
}

/**
 * JsonLdHead - Standardized SEO head component.
 * Core route-level SEO, AEO, GEO and 7-layer schema injection is centrally managed
 * within TooloraContext to guarantee zero duplicate tags or conflicting headers.
 */
export const JsonLdHead: React.FC<JsonLdHeadProps> = () => {
  return null;
};

export default JsonLdHead;
