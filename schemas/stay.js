// places to stay, for some time, with a list of activities nearby!
export default {
  title: "Stay",
  name: "stay",
  type: "object",
  fields: [
    {name: 'Description', type: 'string'},
    { title: "Google Maps URL", name: "gmaps", type: "url" },
    { title: "Stops (fun places nearby to stop at)", name: "stops", type: "array", of: [{ type: "stop" }] },
    { title: "Duration", name: "duration", type: "number" },
    { title: "Notes", name: "notes", type: "array", of: [{ type: "block" }] },
  ],
};
