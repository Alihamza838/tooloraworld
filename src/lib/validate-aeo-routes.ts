/**
 * AEO (Answer Engine Optimization) & Route Validation Utility
 * Validates that every tool route has:
 * 1. A unique, search-intent H1 title
 * 2. A 40-60 word opening summary paragraph
 * 3. A 4-6 item FAQ schema block with high-relevance Q&A pairs
 * 4. Step-by-step HowTo instructions
 */

import { TOOLS } from '../data';
import { TOOL_AEO_DATA, ToolAeoEntry } from '../data/toolAeoData';

export interface AeoValidationIssue {
  toolId: string;
  field: string;
  message: string;
}

export interface AeoValidationReport {
  isValid: boolean;
  totalTools: number;
  validatedTools: number;
  issues: AeoValidationIssue[];
  metrics: {
    toolId: string;
    h1: string;
    wordCount: number;
    faqCount: number;
    howToStepCount: number;
  }[];
}

export function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function validateAllToolAeoRoutes(): AeoValidationReport {
  const issues: AeoValidationIssue[] = [];
  const metrics: AeoValidationReport['metrics'] = [];
  const seenH1s = new Map<string, string>();

  let validatedCount = 0;

  for (const tool of TOOLS) {
    const aeo = TOOL_AEO_DATA[tool.id];

    if (!aeo) {
      issues.push({
        toolId: tool.id,
        field: 'TOOL_AEO_DATA',
        message: `Missing AEO entry for tool "${tool.name}" (id: ${tool.id}) in TOOL_AEO_DATA registry.`
      });
      continue;
    }

    validatedCount++;

    // 1. Validate Unique H1
    if (!aeo.h1 || typeof aeo.h1 !== 'string' || aeo.h1.trim().length === 0) {
      issues.push({
        toolId: tool.id,
        field: 'h1',
        message: `Tool "${tool.id}" has an empty or invalid H1 title.`
      });
    } else {
      const normalizedH1 = aeo.h1.trim().toLowerCase();
      if (seenH1s.has(normalizedH1)) {
        issues.push({
          toolId: tool.id,
          field: 'h1',
          message: `Duplicate H1 detected: "${aeo.h1}" matches tool "${seenH1s.get(normalizedH1)}".`
        });
      } else {
        seenH1s.set(normalizedH1, tool.id);
      }
    }

    // 2. Validate Opening Summary Word Count (40 - 60 words strictly)
    const wordCount = countWords(aeo.openingSummary);
    if (wordCount < 40 || wordCount > 60) {
      issues.push({
        toolId: tool.id,
        field: 'openingSummary',
        message: `Opening summary has ${wordCount} words for tool "${tool.id}". Must be strictly between 40 and 60 words.`
      });
    }

    // 3. Validate FAQ Count (4 - 6 items) & Q/A Content
    if (!Array.isArray(aeo.faqs)) {
      issues.push({
        toolId: tool.id,
        field: 'faqs',
        message: `Tool "${tool.id}" faqs property is not an array.`
      });
    } else {
      const faqCount = aeo.faqs.length;
      if (faqCount < 4 || faqCount > 6) {
        issues.push({
          toolId: tool.id,
          field: 'faqs',
          message: `Tool "${tool.id}" has ${faqCount} FAQs. Must have between 4 and 6 FAQ items.`
        });
      }

      aeo.faqs.forEach((faq, index) => {
        if (!faq.question || faq.question.trim().length < 10) {
          issues.push({
            toolId: tool.id,
            field: `faqs[${index}].question`,
            message: `Tool "${tool.id}" FAQ #${index + 1} has a missing or too short question.`
          });
        }
        if (!faq.answer || faq.answer.trim().length < 20) {
          issues.push({
            toolId: tool.id,
            field: `faqs[${index}].answer`,
            message: `Tool "${tool.id}" FAQ #${index + 1} has a missing or too short answer.`
          });
        }
      });
    }

    // 4. Validate HowTo Schema Steps
    const howToStepCount = aeo.howTo?.steps?.length || 0;
    if (howToStepCount < 3) {
      issues.push({
        toolId: tool.id,
        field: 'howTo',
        message: `Tool "${tool.id}" has fewer than 3 HowTo steps (${howToStepCount}).`
      });
    }

    metrics.push({
      toolId: tool.id,
      h1: aeo.h1 || tool.name,
      wordCount,
      faqCount: aeo.faqs?.length || 0,
      howToStepCount
    });
  }

  const isValid = issues.length === 0;

  return {
    isValid,
    totalTools: TOOLS.length,
    validatedTools: validatedCount,
    issues,
    metrics
  };
}

// Direct CLI execution support
if (process.argv[1]?.endsWith('validate-aeo-routes.ts') || process.env.RUN_AEO_VALIDATION) {
  console.log('🔍 Executing Toolora AEO Route & Schema Validation Audit...\n');
  const report = validateAllToolAeoRoutes();

  console.log(`📊 Validated ${report.validatedTools}/${report.totalTools} tool routes.`);
  
  if (report.isValid) {
    console.log('✅ ALL TOOL AEO REQUIREMENTS FULLY SATISFIED:');
    console.log('  • 100% Unique H1 Headers across all tool routes');
    console.log('  • 100% Opening Summaries strictly between 40 and 60 words');
    console.log('  • 100% FAQ Schemas with 4 to 6 authentic Q&A pairs');
    console.log('  • 100% Structured HowTo Steps verified for rich snippet capture\n');
    process.exit(0);
  } else {
    console.error(`\n❌ Found ${report.issues.length} AEO validation issues:\n`);
    report.issues.forEach((issue) => {
      console.error(`  - [${issue.toolId}] ${issue.field}: ${issue.message}`);
    });
    process.exit(1);
  }
}
