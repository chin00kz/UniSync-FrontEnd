/**
 * validation.js — UniSync shared form validation utilities
 */

const FORBIDDEN_TITLE_CHARS = /[!@#$%^&*]/;
const FORBIDDEN_EXTENSIONS = /\.(exe|js|sql|bat|cmd|sh)$/i;
const ALLOWED_EXTENSIONS = /\.(pdf|doc|docx|jpg|jpeg|png|ppt|pptx|txt)$/i;

/**
 * Validates a note title.
 * @param {string} title
 * @returns {{ valid: boolean, error: string }}
 */
export function validateNoteTitle(title) {
  if (!title || !title.trim()) {
    return { valid: false, error: 'Title is required.' };
  }
  if (FORBIDDEN_TITLE_CHARS.test(title)) {
    return {
      valid: false,
      error: 'Title cannot contain special characters (!, @, #, $, %, ^, &, *)',
    };
  }
  if (title.trim().length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters.' };
  }
  return { valid: true, error: '' };
}

/**
 * Validates a file for upload.
 * @param {File | null} file
 * @returns {{ valid: boolean, error: string }}
 */
export function validateUploadFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select a file to upload.' };
  }
  if (FORBIDDEN_EXTENSIONS.test(file.name)) {
    return {
      valid: false,
      error: 'Executable, script, or database files (.exe, .js, .sql) are not allowed.',
    };
  }
  if (!ALLOWED_EXTENSIONS.test(file.name)) {
    return {
      valid: false,
      error: 'Only PDF, DOC, DOCX, JPG, PNG, PPT, or TXT files are allowed.',
    };
  }
  return { valid: true, error: '' };
}
