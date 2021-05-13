import axios from "axios";

export async function getDicts() {
  try {
    const dicts = await axios.get("/dict?api=1");
    return [dicts];
  } catch (e) {
    return [null, e];
  }
}
