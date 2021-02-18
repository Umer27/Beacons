/**
 * @description Use for handling side effects
 * @export
 * @param cb a function to handle side effects
 * @returns
 */
export function tap<T>(cb: (res: T) => unknown): (res: T) => T {
  return (res: T): T => {
    cb(res);
    return res;
  };
}
