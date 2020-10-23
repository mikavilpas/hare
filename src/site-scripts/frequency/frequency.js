let frequencies;

async function init() {
  const response = await fetch(
    "https://sp3ctum.github.io/sakura-paris-customizations/frequency.txt"
  );
  const text = await response.text();

  const freqs = Object.fromEntries(
    text.split(/\r?\n/).map((word, index) => [word, index])
  );
  frequencies = freqs;
}

function frequency(word) {
  const index = frequencies[word];

  // migaku dictionary frequency logic
  let rating = 0;
  if (index <= 1500) rating = 5;
  else if (index <= 5000) rating = 4;
  else if (index <= 15000) rating = 3;
  else if (index <= 30000) rating = 2;
  else if (index <= 60000) rating = 2;

  return { index, rating };
}

init().then(() => {
  window.freq = frequency;
});
console.log("Loaded frequency.js");

export function wordTitleFrequency(title) {
  const [_pattern, word] = title.match(/【(.+?)】/);
  return frequency(word);
}

// word-title-text
function addFrequencyInfoToWordTitles() {
  document.querySelectorAll(".word-title-text").forEach((elem) => {
    // data looks like
    // "あたい【私】"
    const title = elem.innerText;
    const text = wordTitleFrequency(title);
    console.log(`title ${title} frequency ${JSON.stringify(text)}`);
  });
}

// window.addEventListener("DOMNodeInserted", externalLinksAsNewTabs);
