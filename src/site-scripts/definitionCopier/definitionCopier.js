const delimiters = ["「", "」", "。"];
const wordPlaceholder = "―";

function sentenceForward(input, index) {
  const remainingText = input.substring(index);
  const untilIndex = Array.from(remainingText).findIndex((c) =>
    delimiters.includes(c)
  );
  return remainingText.substring(0, untilIndex);
}

function sentenceBackward(input, index) {
  const precedingText = reverse(input.substring(0, index));
  const untilIndex = Array.from(precedingText).findIndex((c) =>
    delimiters.includes(c)
  );
  return reverse(precedingText.substring(0, untilIndex));
}

function sentence(input, index) {
  const before = sentenceBackward(input, index) || "";
  const after = sentenceForward(input, index) || "";
  console.log(before, after);
  return `${before}${after}`;
}

function reverse(s) {
  return s.split("").reverse().join("");
}

export { sentence };
