export async function loadFileText(path) {
  const file = await fetch(path);
  return file.text();
}
