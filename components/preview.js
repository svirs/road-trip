import S from "@sanity/desk-tool/structure-builder";
import React, { useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";

import { getPlaceData } from "../utils/gmapsUrl";

const Previewer = ({ document: doc }) => {
  const MAPS_API = process.env.SANITY_STUDIO_MAPS_API;
  const [route, setRoute] = useState({});
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);

  const displayedData = doc.displayed;

  useDeepCompareEffect(() => {
    setRoute(
      displayedData.route.reduce((acc, ele, idx, { length }) => {
        const key =
          idx === 0
            ? "origin"
            : idx === length - 1
            ? "destination"
            : "waypoint";
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
      }, {})
    );
    setStops(
      displayedData.route.map((stay) => {
        return {
          name: stay.Description,
          loc: encodeURIComponent(
            getPlaceData(stay.gmaps, stay.Description).name
          ),
          stops: stay.stops?.map((stop) =>
            encodeURIComponent(getPlaceData(stop.gmaps, stop.Description).name)
          ),
        };
      })
    );
  }, [displayedData]);

  const routeParamsString = Object.entries(route)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const currentStops =
    stops.filter((stop) => stop.name === selectedStop)[0]?.stops ?? {};

  const stopsParamString = Object.entries(currentStops)
    .map(([k, v]) => v)
    .join("|");

  const currentStay =
    stops.filter((stop) => stop.name === selectedStop)[0]?.loc ?? null;

  const handleSelectedStop = (event) => {
    setSelectedStop(event.target.value);
  };

  return (
    <>
      <h1>{displayedData.Description}</h1>
      <iframe
        frameborder="0"
        style={{ width: "100%", height: "80%" }}
        src={`https://www.google.com/maps/embed/v1/directions?key=${MAPS_API}&${routeParamsString}`}
      />
      <select onChange={handleSelectedStop}>
        <option disabled selected value>
          {" -- select a stay! -- "}
        </option>

        {stops.map((stay) => (
          <option value={stay.name}>{stay.name}</option>
        ))}
      </select>
      {selectedStop ? (
        stopsParamString ? (
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?size=640x640&key=${MAPS_API}&markers=color:purple|${stopsParamString}${
              currentStay ? `&center=${currentStay}` : ""
            }`}
          />
        ) : (
          "No stops in this stay!"
        )
      ) : null}
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
