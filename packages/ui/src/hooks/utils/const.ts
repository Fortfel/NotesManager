// @see https://github.com/react-hookz/web/blob/master/src/util/const.ts
/* eslint-disable */
import type { ConditionsPredicate, Predicate } from '@workspace/ui/hooks/utils/types'

export const noop = (): void => {}

export const isBrowser =
  typeof globalThis !== 'undefined' && typeof navigator !== 'undefined' && typeof document !== 'undefined'

/**
 * You should only be reaching for this function when you're attempting to prevent multiple
 * redefinitions of the same function. In-place strict equality checks are more performant.
 */

export const isStrictEqual: Predicate = (previous: any, next: any): boolean => previous === next

export const truthyAndArrayPredicate: ConditionsPredicate = (conditions): boolean => conditions.every(Boolean)

export const truthyOrArrayPredicate: ConditionsPredicate = (conditions): boolean => conditions.some(Boolean)
