

import { google } from "@ai-sdk/google";

/**
 * Single place to switch Gemini models.
 * Requires: GOOGLE_GENERATIVE_AI_API_KEY
 */
export function getChatModel() {
  return google("gemini-3.5-flash-lite");
  // return google("gemini-3.8-flash");
}