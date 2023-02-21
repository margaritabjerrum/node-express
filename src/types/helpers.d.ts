type PartialRecursive<T extends Dictionary<string, any>> = {
  [Key in keyof T]?:
  T[Key] extends Dictionary<string, any>
    ? PartialRecursive<T[Key]>
    : T[Key] extends any[]
      ? T[Key][0] extends Dictionary<string, any>
        ? PartialRecursive<T[Key][0]>[]
        : T[Key]
      : T[Key]
};
