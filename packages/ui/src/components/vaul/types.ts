// copied from https://github.com/emilkowalski/vaul
// @ts-nocheck
export type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';
export interface SnapPoint {
  fraction: number;
  height: number;
}

export type AnyFunction = (...args: any) => any;
