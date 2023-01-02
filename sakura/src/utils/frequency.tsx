let frequencies: { [key: string]: number };

export interface WordFrequency {
  index: number;
  rating: number;
}
export function frequency(word: string): WordFrequency | undefined {
  if (!frequencies) return undefined;
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

export function initFrequencyList(): Promise<void> | undefined {
  if (frequencies) return undefined;

  // load in browser
  return fetch("https://sp3ctum.github.io/hare/static/public/frequency.json")
    .then((response) => response.json())
    .then((jsonArray) => {
      const freqs = Object.fromEntries(
        jsonArray.map((word: string, index: number) => [word, index])
      );
      frequencies = freqs;
    })
    .then(() => {
      (window as any).frequency = frequency;
      console.log("Loaded frequency list.");
    });
}

export function highestFrequency(
  definitionWords: string[]
): number | undefined {
  const frequencies = definitionWords.flatMap((w) => [
    frequency(w),
    frequency(w + "する"),
  ]);

  const freq = frequencies
    .filter((f) => f) // might not have been loaded yet - just ignore
    .map((f) => f?.rating)
    .sort()
    .reverse()?.[0];
  return freq;
}
