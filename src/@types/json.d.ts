interface JSON {
  stringify<T>(value: T, replacer?: (this: any, key: string, value: any) => any, space?: number | string): string;
  parse<T>(text: string, reviver?: (this: any, key: string, value: any) => any): T;
}
