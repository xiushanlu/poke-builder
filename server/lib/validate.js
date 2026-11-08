export const MAX_TEAM = 6
export function isValidIds(ids) {
  return Array.isArray(ids) && ids.length >= 1 && ids.length <= MAX_TEAM
    && ids.every(id => Number.isInteger(id) && id > 0)
    && new Set(ids).size === ids.length
}