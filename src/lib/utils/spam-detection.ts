/**
 * Lightweight, no-external-API spam heuristics for public forms:
 *  1. Honeypot: a hidden field real visitors never see or fill in. If it
 *     has a value, the submitter is almost certainly a bot script that
 *     fills every field it finds.
 *  2. Minimum time-on-page: a bot that submits within ~1.5s of the page
 *     loading almost certainly didn't "fill out" the form like a human.
 */
export function looksLikeSpam(honeypot?: string, formRenderedAt?: number, now: number = Date.now()): boolean {
  if (honeypot && honeypot.trim().length > 0) return true;
  if (formRenderedAt && now - formRenderedAt < 1500) return true;
  return false;
}
