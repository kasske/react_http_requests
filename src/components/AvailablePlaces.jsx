import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import { useFetch } from "../hooks/useFetch.js";

async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );

      resolve(sortedPlaces);
    });
  });
}

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isFetching,
    error,
    fetchedData: availablePlaces,
  } = useFetch(fetchSortedPlaces, []);

  /* if no error manipulate data and set places*/
  // navigator.geolocation.getCurrentPosition((position) => {
  //   const sortedPlaces = sortPlacesByDistance(
  //     places,
  //     position.coords.latitude,
  //     position.coords.longitude
  //   );

  //   setAvailablePlacces(sortedPlaces);
  //   setIsFetching(false);
  // });

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
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
