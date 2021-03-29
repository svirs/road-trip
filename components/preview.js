import S from "@sanity/desk-tool/structure-builder";
import React from "react";
import { getPlaceData } from "../utils/gmapsUrl";

const Previewer = ({ document: doc }) => {
  const MAPS_API = process.env.SANITY_STUDIO_MAPS_API;
  const displayedData = doc.displayed;
  const paramsObject = displayedData.route.reduce(
    (acc, ele, idx, { length }) => {
      const key =
        idx === 0 ? "origin" : idx === length - 1 ? "destination" : "waypoint";
      const placeId = encodeURIComponent(
        getPlaceData(ele.gmaps, ele.Description).name
      );
      if (key === "waypoint") {
        const firstWaypointId = acc.waypoints === undefined;
        return {
          ...acc,
          waypoints: firstWaypointId
            ? `${placeId}`
            : `${acc.waypoints}|${placeId}`,
        };
      } else {
        return { ...acc, [key]: `${placeId}` };
      }
    },
    {}
  );
  const paramsString = Object.entries(paramsObject)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  return (
    <>
      <h1>{displayedData.Description}</h1>
      <iframe
        frameborder="0"
        style={{ width: "100%", height: "80%" }}
        src={`https://www.google.com/maps/embed/v1/directions?key=${MAPS_API}&${paramsString}`}
      />
    </>
  );
};

export const getDefaultDocumentNode = () => {
  return S.document().views([
    S.view.form(),
    S.view.component(Previewer).title("Preview"),
  ]);
};

export default () =>
  S.list()
    .title("Make a route!")
    .items([...S.documentTypeListItems()]);
