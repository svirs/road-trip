// whole route, composed of places to stay
export default {
  title: "Road Trip Route!",
  name: "roadtrip",
  type: "document",
  fields: [
    {name: 'Description', type: 'string'},
    {
      title: "Route (composed of places to stay)",
      name: "route",
      type: "array",
      of: [{ type: "stay" }],
    },
    {
      title: "Notes",
      name: "notes",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};
