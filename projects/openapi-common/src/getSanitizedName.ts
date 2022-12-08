export function getSanitizedName(input: string): string {
  return input.replace(/[^a-zA-Z0-9]+/g, '_')
}
