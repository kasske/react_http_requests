import { useState, useEffect } from "react";

import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlacces, setAvailablePlacces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    /* async call for fetch places */
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        /* helper function */
        const places = await fetchAvailablePlaces();

        /* if no error manipulate data and set places*/
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );

          setAvailablePlacces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again later!",
        });
        setIsFetching(false);
      }
    }

    /* call fetch places */
    fetchPlaces();
  }, []);

  if (error) {
    return (
      <Error
        title="An error occurred!"
        message={error.message}
      ></Error>
    );
  }

  return (
    <Places
      title="Available Places"
      isLoading={isFetching}
      loadingText={"Loading..."}
      places={availablePlacces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
