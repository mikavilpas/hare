// cache for definition queries only
export class DefinitionCache {
  constructor() {
    this.cache = {};
  }

  store(dictName, queryWord, result) {
    const hash = this.hashed(dictName, queryWord);
    this.cache[hash] = result;
  }

  get(dictName, queryWord) {
    const hash = this.hashed(dictName, queryWord);
    return this.cache[hash];
  }

  hashed(dictName, queryWord) {
    return `${dictName}/${queryWord}`;
  }
}
