// loads the definition contents for the given dict and word
export function loadResult(dictName, queryWord) {
  // https://sakura-paris.org/About/広辞苑無料検索/API
  // "https://sakura-paris.org/dict/?api=1&dict=%E5%A4%A7%E8%BE%9E%E6%B3%89&q=%E7%BF%BB%E8%A8%B3&type=0"
  const params = new URLSearchParams();
  params.append("api", "1");
  params.append("dict", dictName);
  params.append("q", queryWord);

  return fetch(`/dict/?${params}`).then((res) => res.json());
}
