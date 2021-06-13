let frequencies;

export function frequency(word) {
  if (!frequencies) return null;
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

export function initFrequencyList() {
  if (frequencies) return null;

  // load in browser
  return fetch("https://sp3ctum.github.io/hare/static/public/frequency.json")
    .then((response) => response.json())
    .then((jsonArray) => {
      const freqs = Object.fromEntries(
        jsonArray.map((word, index) => [word, index])
      );
      frequencies = freqs;
    })
    .then(() => {
      window.frequency = frequency;
      console.log("Loaded frequency list.");
    });
}
