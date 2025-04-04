/**
 * Import necessary libraries and components.
 */
import {
  Text,
  View,
  Button,
  ScrollView,
  Pressable,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity 
} from "react-native";
import { useEffect, useState } from "react";
import { dayButtonStyle } from "./style";
import { useLocalSearchParams, useRouter } from "expo-router";
import BottomSheet from "../components/BottomSheet";
import {
  clearMarkers,
  moveToLocation,
  setMarker,
  fitMarkers,
} from "./utils/googlemap";
import {
  removeCommute,
  removeCommuteFromFirestore,
} from "./utils/accountStorage";
import {
  validateArrivalTime,
  validateCommuteName,
  validateAverageDuration,
  validateLatLong,
} from "./utils/input_validation";
import { getLatLong, getDateYYYYMMDD } from "./utils/helperFunctions";
import Commute from "./utils/commute";
import useDebouncedState from "./utils/useDebouncedState";
import JourneyButton from "../components/journeyButton";
import CustomInput from "../components/customInput";

/* 
* endregion
*/

/**
 * Importing additional styles for buttons and text used in the component.
 * - logButtonStyle: Style for log buttons (e.g., Delete, Save, Cancel, Submit).
 * - textStyles: Style for text elements in the component.
 */
import { logButtonStyle, textStyles } from "./style";

/**
 * CommuteTestScreen Component
 * This component is responsible for rendering the commute editing screen.
 * It initializes the commute data from the search parameters and provides
 * functionality to edit and manage commute details.
 */
export default function CommuteTestScreen() {
  // Retrieve search parameters passed to this screen
  const localSearchParams = useLocalSearchParams(); 

  // State to hold the loaded commute object, initialized using the search parameters
  const [loadedCommute, setLoadedCommute] = useState(() =>
    BuildCommuteObject(localSearchParams)
  );

  // Router object to handle navigation between screens
  const router = useRouter();

  // #region Input field data
  const [name, setName] = useState(loadedCommute.name || "");
  const [origin, setOrigin] = useDebouncedState(
    loadedCommute.origin || "",
    500,
    async (text) => {
      await handleOriginInput(text);
    }
  );

  /**
   * State to manage the destination input field.
   * - `destination`: Holds the value of the destination input field.
   * - `setDestination`: Updates the destination value and triggers a debounced callback.
   * The debounced callback is executed after 500ms of inactivity and calls `handleDestinationInput` to process the input.
   */
  const [destination, setDestination] = useDebouncedState(
    loadedCommute.destination || "",
    500,
    async (text) => {
      await handleDestinationInput(text);
    }
  );

  /**
   * State to manage the arrival time input field.
   * - `arrivalTime`: Holds the value of the arrival time input field.
   * - `setArrivalTime`: Updates the arrival time value.
   * This value is used to determine the time of arrival for the commute.
   */
  const [arrivalTime, setArrivalTime] = useState(
    loadedCommute.arrivalTime || ""
  );
  const [selectedDays, setSelectedDays] = useState(loadedCommute.days || []);
  const [duration, setDuration] = useState(loadedCommute.duration || 0);
  const [journeyId, setJourneyId] = useState(loadedCommute.journeyId || "");
  // #endregion

  /**
   * State to manage the loading state of the origin and destination inputs.
   * - `originLoading`: Indicates if the origin input is currently loading.
   * - `destinationLoading`: Indicates if the destination input is currently loading.
   * These states are used to show loading indicators while fetching latitude and longitude data.
   */

  // #region Screen variables
  const [contentHeight, setContentHeight] = useState(0);
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const NAV_BAR_HEIGHT = 600;
  const [panelHeight, setPanelHeight] = useState(SCREEN_HEIGHT * 0.5);
  const availableHeight = panelHeight - NAV_BAR_HEIGHT;
  const isScrollable = contentHeight > availableHeight;
  // #endregion

  /**
   * State to manage the latitude and longitude of the origin and destination.
   * - `originLatLong`: Holds the latitude and longitude of the origin location.
   * - `destinationLatLong`: Holds the latitude and longitude of the destination location.
   * These values are used to set markers on the map and update the journeys.
   */
  const [originLatLong, setOriginLatLong] = useState(
    loadedCommute.originLatLong || ""
  );
  const [destinationLatLong, setDestinationLatLong] = useState(
    loadedCommute.destinationLatLong || ""
  );
  /**
   * State to manage the loading state of the origin and destination inputs.
   * - `originLoading`: Indicates if the origin input is currently loading.
   * - `destinationLoading`: Indicates if the destination input is currently loading.
   * These states are used to show loading indicators while fetching latitude and longitude data.
   */
  const [originLoading, setOriginLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const originInputValid = !originLoading && originLatLong != null;
  const destinationInputValid =
    !destinationLoading && destinationLatLong != null;
  const [commuteIdToDelete, setCommuteIdToDelete] = useState(
    loadedCommute.commuteId || ""
  );
  /**
   * State to manage the loading state of the journeys.
   * - `journeys`: Holds the list of journeys fetched from the Commute utility.
   * - `setJourneys`: Updates the list of journeys.
   * - `journeysLoading`: Indicates if the journeys are currently loading.
   * This state is used to show a loading indicator while fetching journeys.
   */
  const [journeys, setJourneys] = useState([]);
  const [journeysLoading, setJourneysLoading] = useState(false);
  const days = [
    { id: 1, name: "Mon" },
    { id: 2, name: "Tues" },
    { id: 3, name: "Wed" },
    { id: 4, name: "Thurs" },
    { id: 5, name: "Fri" },
    { id: 6, name: "Sat" },
    { id: 0, name: "Sun" },
  ];

  /**
   * Effect to set the initial markers on the map when the component mounts.
   * - Sets the origin marker if the origin input is valid.
   */
  useEffect(() => {
    return () => {
      console.log("COMPONENT CLOSING");
      clearMarkers();
    };
  }, []);

  /**
   * Effect to update the journeys when the component mounts or when the origin or destination changes.
   * - Calls the `UpdateJourneys` function to fetch the journeys based on the current origin and destination.
   */
  async function handleDestinationInput(text) {
    setDestinationLoading(true);
    const latLong = await getLatLong(text);
    setDestinationLatLong(latLong);
    setDestinationLoading(false);
    await UpdateJourneys(originLatLong, latLong);
    setMarker(2, latLong);
    if (originInputValid) {
      fitMarkers();
    } else {
      moveToLocation(latLong);
    }
  }

  /**
   * Function to handle the origin input field.
   * - Sets the loading state to true while fetching the latitude and longitude.
   * - Calls the `getLatLong` function to fetch the latitude and longitude based on the input text.
   * - Updates the `originLatLong` state with the fetched latitude and longitude.
   * - Calls the `UpdateJourneys` function to fetch the journeys based on the current origin and destination.
   * - Sets the marker on the map for the origin location.
   */
  async function handleOriginInput(text) {
    setOriginLoading(true);
    const latLong = await getLatLong(text);
    setOriginLatLong(latLong);
    setOriginLoading(false);
    await UpdateJourneys(latLong, destinationLatLong);
    setMarker(1, latLong);
    if (destinationInputValid) {
      console.log("Fitting markers");
      fitMarkers();
    } else {
      moveToLocation(latLong);
    }
  }

  /**
   * Function to toggle the selection of a day in the days array.
   * - If the day is already selected, it removes it from the selectedDays array.
   * - If the day is not selected, it adds it to the selectedDays array.
   */
  function toggleItem(id) {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }
  /**
   * Function to update the journeys based on the current origin and destination.
   * - It checks if the origin, destination, and selected days are valid before proceeding.
   * - Calls the `Commute.getAllUniqueJourneys` function to fetch the journeys based on the current parameters.
   * - Updates the `journeys` state with the fetched journeys.
   * - Sets the loading state to false after fetching the journeys.
   */
  async function UpdateJourneys(origin, destination) {
    console.log(
      "Attempting to update journeys using origin:" +
        originLatLong +
        " and destination:" +
        destinationLatLong
    );
    if (origin == null) {
      console.log("Can't update journey due to origin");
      return;
    }
    if (destination == null) {
      console.log("Can't update journey due to destination");
      return;
    }
    if (selectedDays.length === 0) {
      console.log("Can't update journey due to no selected days");
      return;
    }
    if (!validateArrivalTime(arrivalTime)) {
      console.log("Can't update journey due to arrival time");
      return;
    }
    console.log("Updating Journeys");
    setJourneysLoading(true);
    const journeys = await Commute.getAllUniqueJourneys(
      origin,
      destination,
      arrivalTime,
      selectedDays
    );
    /**
     * Check if the current journeyId is still valid.
     */
    let currentJourneyFound = false;
    for (const journey of journeys) {
      if (Commute.buildJourneyId(journey) == journeyId) {
        currentJourneyFound = true;
        break;
      }
    }
    /**
     * If the current journeyId is not found in the new journeys, set it to null.
     * This is to ensure that the user can select a new journey if needed.
     */
    console.log("current j found: " + currentJourneyFound);
    if (!currentJourneyFound) {
      setJourneyId(null);
    }
    setJourneys(journeys);
    setJourneysLoading(false);
  }
  /**
   * Function to remove a commute from the list of journeys.
   * - It checks if the commuteId is valid before proceeding.
   * - Calls the `removeCommute` function to remove the commute from the list.
   */
  return (
    /**
     * Render the CommuteTestScreen component.
     * It displays a bottom sheet with input fields for the commute details,
     * including origin, destination, arrival time, and selected days.
     */
    <BottomSheet
      halfHeight={SCREEN_HEIGHT * 0.5}
      onDismiss={() => {
        router.replace("/home");
        clearMarkers();
      }}
      onHeightChange={(h) => {
        setPanelHeight(h);
      }}
    >

      <ScrollView
        scrollEnabled={isScrollable}
        contentContainerStyle={{
          paddingBottom: NAV_BAR_HEIGHT, // ensures extra space for nav bar
        }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setContentHeight(height);
        }}
      >
        <Text style={textStyles.panelTitle}>Commute</Text>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <CustomInput
            name="Nickname:"
            placeholder="Give your commute a name"
            value={name}
            onChangeText={setName}
            errorCheck={validateCommuteName(name)}
            width={"100%"}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              padding: 1,
              marginTop: 10,
            }}
          >
            <CustomInput
              name="Origin:"
              placeholder="Where do you start?"
              value={origin}
              onChangeText={async (text) => {
                setOrigin(text);
              }}
              errorCheck={validateLatLong(originLatLong)}
              width={"50%"}
            />

            <CustomInput
              name="Destination:"
              placeholder="Where are you headed?"
              value={destination}
              onChangeText={async (text) => {
                await setDestination(text);
              }}
              errorCheck={validateLatLong(destinationLatLong)}
              width={"50%"}
            />
          </View>

          {commuteIdToDelete ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                padding: 1,
              }}
            >
              <CustomInput
                name="Time:"
                placeholder="What time do you arrive?"
                value={arrivalTime}
                onChangeText={async (text) => {
                  setArrivalTime(text);
                  await UpdateJourneys(originLatLong, destinationLatLong);
                }}
                errorCheck={validateArrivalTime(arrivalTime)}
                width={"50%"}
              />
              <CustomInput
                name="Duration:"
                placeholder="How long does this usually take?"
                value={duration}
                onChangeText={(text) => {
                  setDuration(parseInt(text));
                }}
                errorCheck={validateAverageDuration(duration)}
                width={"50%"}
              />
            </View>
          ) : (
            <CustomInput
              name="Time:"
              placeholder="What time do you arrive?"
              value={arrivalTime}
              onChangeText={async (text) => {
                setArrivalTime(text);
                await UpdateJourneys(originLatLong, destinationLatLong);
              }}
              errorCheck={validateArrivalTime(arrivalTime)}
              width={"100%"}
            />
          )}
        </View>
        <Text style={{ color: "white", textAlign: "center" }}>Days:</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            padding: 5,
          }}
        >
          {days.map((item) => (
            <Pressable
              key={item.id}
              onPress={async () => {
                toggleItem(item.id);
                await UpdateJourneys(originLatLong, destinationLatLong);
              }}
              style={
                selectedDays.includes(item.id)
                  ? dayButtonStyle.selected
                  : dayButtonStyle.unselected
              }
            >
              <Text style={dayButtonStyle.text}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
        {!journeysLoading ? (
          <FlatList
            style={{
              flexGrow: 0,
              width: "80%",
              alignContent: "center",
              alignSelf: "center",
            }}
            data={journeys}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <JourneyButton
                journey={item}
                journeyId={journeyId}
                setJourneyId={setJourneyId}
              />
            )}
          />
        ) : (
          <ActivityIndicator size={50} color="#DC9F85" />
        )}
        {commuteIdToDelete ? (
          <View
            style={{
              marginTop: 40,
              flexDirection: "row",
              padding: 20,
              justifyContent: "center",  // Centers the row of buttons horizontally
              alignItems: "center",  
            }}
          >
            <TouchableOpacity
            style={[logButtonStyle, {backgroundColor: "rgba(255, 0, 0, 0.1)"}]}
              onPress={() => {
                removeCommute(commuteIdToDelete);
                removeCommuteFromFirestore(commuteIdToDelete);
                router.replace("/home");
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[logButtonStyle, {backgroundColor:"rgba(0, 255, 0, 0.1)"}]}
              onPress={() => {
                removeCommute(commuteIdToDelete);
                removeCommuteFromFirestore(commuteIdToDelete);
                const newCommute = new Commute(
                  name,
                  origin,
                  originLatLong,
                  destination,
                  destinationLatLong,
                  arrivalTime,
                  selectedDays,
                  journeyId,
                  parseInt(duration, 10)
                );
                newCommute.init();
                setLoadedCommute(newCommute);
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Save</Text>
              </TouchableOpacity>

            <TouchableOpacity
            style={[logButtonStyle, {backgroundColor: "rgba(39, 92, 240, 0.1)"}]}
              title="Delay Check"
              onPress={async () => {
                await loadedCommute.checkForDelay(new Date());
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Delays</Text>
              </TouchableOpacity>
          </View>
        ) : (
          
          <View
          style={{
            alignItems: "center",
            marginTop: 20,
            flexDirection: "row",
            padding: 20,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {/* Cancel Button */}
          <TouchableOpacity
            style={[logButtonStyle, {backgroundColor: "rgba(255, 0, 0, 0.1)"}]}
            onPress={() => {
              removeCommute(commuteIdToDelete);
              removeCommuteFromFirestore(commuteIdToDelete);
              router.replace("/home");
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
    
          {/* Submit Button */}
          <TouchableOpacity
            style={[logButtonStyle, { backgroundColor:"rgba(0, 255, 0, 0.1)"}]}
            onPress={() => {
              removeCommute(commuteIdToDelete);
              removeCommuteFromFirestore(commuteIdToDelete);
              const newCommute = new Commute(
                name,
                origin,
                originLatLong,
                destination,
                destinationLatLong,
                arrivalTime,
                selectedDays,
                journeyId,
                parseInt(duration, 10)
              );
              newCommute.init();
              setLoadedCommute(newCommute);
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16,}}>Submit</Text>
          </TouchableOpacity>
        </View>
      
        )}
      </ScrollView>
    </BottomSheet>
  );
}

function BuildCommuteObject(params) {
  if (params.commuteId != undefined) {
    let loadedCommute = new Commute(
      params.name,
      params.origin,
      params.originLatLong,
      params.destination,
      params.destinationLatLong,
      params.arrivalTime,
      JSON.parse(params.days),
      params.journeyId,
      params.duration,
      params.commuteId
    );
    return loadedCommute;
  }
  return new Commute("", "", "", "", "", "", [], "", 0, "");
}
