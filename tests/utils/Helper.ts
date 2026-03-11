/**
 * Utility class for shared test helper functions.
 */
export class Helper {
  /**
   * Generates a readable timestamp (YYYY-MM-DD HH:mm:ss)
   * Useful for generating unique test data.
   */
  static getFormattedTimestamp(): string {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
}