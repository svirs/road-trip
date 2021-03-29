import { gmapsUrlValidator } from "../utils/gmapsUrl";

export default {
  title: "Stop",
  name: "stop",
  type: "object",
  fields: [
    { name: "Description", type: "string" },
    {
      title: "Google Maps URL",
      name: "gmaps",
      type: "url",
      validation: gmapsUrlValidator
    },
    { title: "Notes", name: "notes", type: "array", of: [{ type: "block" }] },
  ],
};
