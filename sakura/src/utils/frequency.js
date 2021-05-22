let frequencies = {};

async function initFrequencyList(jsonArray) {
  const freqs = Object.fromEntries(
    jsonArray.map((word, index) => [word, index])
  );
  frequencies = freqs;
}

function frequency(word) {
  const index = frequencies[word] || 999999;

  // migaku dictionary frequency logic
  let rating = 0;
  if (index <= 1500) rating = 5;
  else if (index <= 5000) rating = 4;
  else if (index <= 15000) rating = 3;
  else if (index <= 30000) rating = 2;
  else if (index <= 60000) rating = 2;

  return { index, rating };
}

export function words(title) {
  const insideBrackets = () => {
    const [_, word] = title.match(/【(.+?)】/);
    return [word];
  };

  const manyWords = () => {
    // many words separated by "・"
    const [wordDefinition] = insideBrackets();
    return wordDefinition
      .replace(/＝/g, "")
      .replace(/×/g, "")
      .replace(/△/g, "")
      .replace(/（.*?）/g, "")
      .split("・");
  };

  try {
    return manyWords() || insideBrackets();
  } catch (_) {}
}

async function initScript() {
  // load in browser
  return fetch(
    "https://sp3ctum.github.io/sakura-paris-customizations/frequency.json"
  )
    .then((response) => response.json())
    .then(initFrequencyList)
    .then(() => {
      window.frequency = frequency;
      console.log("Loaded frequency list.");
    });
}
