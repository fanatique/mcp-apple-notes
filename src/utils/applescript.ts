import { spawnSync } from 'child_process';
import type { AppleScriptResult } from '@/types.js';

/**
 * Executes an AppleScript command and returns the result
 * @param script - The AppleScript command to execute
 * @returns Object containing success status and output/error
 */
export function runAppleScript(script: string): AppleScriptResult {
  const normalizedScript = script.trim();

  const { status, stdout, stderr, error } = spawnSync('osascript', {
    input: normalizedScript,
    encoding: 'utf8',
    timeout: 10000, // 10 second timeout
    maxBuffer: 10 * 1024 * 1024
  });

  if (status === 0 && !error) {
    return {
      success: true,
      output: stdout.trim()
    };
  }

  const message =
    error?.message ||
    stderr?.trim() ||
    'Unknown error occurred while executing AppleScript';

  return {
    success: false,
    output: stdout?.trim() ?? '',
    error: message
  };
}

/**
 * Escapes user-controlled text for inclusion in AppleScript string literals.
 * @param value - Arbitrary user input that needs to be made safe.
 */
export function escapeAppleScriptString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}
