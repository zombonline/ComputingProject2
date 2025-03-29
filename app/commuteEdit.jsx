// #region imports
import { Text, View, Button, TextInput, ScrollView, Pressable, FlatList, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { commuteTestStyles } from "./style";
import { useLocalSearchParams, useRouter } from "expo-router";
import BottomSheet from "../components/BottomSheet";
import { clearMarkers, moveToLocation, setMarker, fitMarkers } from "./utils/googlemap";
import { removeCommute, removeCommuteFromFirestore } from "./utils/accountStorage";
import { validateArrivalTime, validateCommuteName, validateAverageDuration } from "./utils/input_validation";
import { getLatLong, getDateYYYYMMDD } from "./utils/helperFunctions";
import Commute from "./utils/commute";
import useDebouncedState from "./utils/useDebouncedState";
// #endregion

export default function CommuteTestScreen() {
  const localSearchParams = useLocalSearchParams(); //get data fed in when opening this screen
  const [loadedCommute, setLoadedCommute] = useState(() => BuildCommuteObject(localSearchParams));
  const router = useRouter();

  // #region Input field data
  const [name, setName] = useState(loadedCommute.name || "");
  const [origin, setOrigin] = useDebouncedState(loadedCommute.origin || "", 500, async (text) => {
    await handleOriginInput(text);
  });
  const [destination, setDestination] = useDebouncedState(loadedCommute.destination || "", 500, async (text) => {
    await handleDestinationInput(text);
  });
  const [arrivalTime, setArrivalTime] = useState(loadedCommute.arrivalTime || "");
  const [selectedDays, setSelectedDays] = useState(loadedCommute.days || []);
  const [duration, setDuration] = useState(loadedCommute.duration || 0);
  const [journeyId, setJourneyId] = useState(loadedCommute.journeyId || "");
  // #endregion

  // #region Screen variables
  const [contentHeight, setContentHeight] = useState(0);
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const NAV_BAR_HEIGHT = 600;
  const [panelHeight, setPanelHeight] = useState(SCREEN_HEIGHT * 0.5);
  const availableHeight = panelHeight - NAV_BAR_HEIGHT;
  const isScrollable = contentHeight > availableHeight;
  // #endregion
  
  
  const [originLatLong, setOriginLatLong] = useState(loadedCommute.originLatLong || "",);
  const [destinationLatLong, setDestinationLatLong] = useState(loadedCommute.destinationLatLong || "");
  const [originLoading, setOriginLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const originInputValid = !originLoading && originLatLong != null;
  const destinationInputValid = !destinationLoading && destinationLatLong != null;

  const [commuteIdToDelete, setCommuteIdToDelete] = useState(loadedCommute.commuteId || "");
  const [journeys, setJourneys] = useState([]);
  const days = [
    { id: 1, name: "Mon" },
    { id: 2, name: "Tues" },
    { id: 3, name: "Wed" },
    { id: 4, name: "Thurs" },
    { id: 5, name: "Fri" },
    { id: 6, name: "Sat" },
    { id: 0, name: "Sun" },
  ];
  useEffect(() => {
    return () => {
    console.log("COMPONENT CLOSING")
    clearMarkers();
    }
  }, []);
  async function handleDestinationInput(text) {
    setDestinationLoading(true);
    const latLong = await getLatLong(text);
    setDestinationLatLong(latLong);
    setDestinationLoading(false);
    await UpdateJourneys(originLatLong, latLong);
    setMarker(2, latLong);
    if(originInputValid){
      fitMarkers();
    } else {
      moveToLocation(latLong);
    }
  }
  async function handleOriginInput(text) {
    setOriginLoading(true);
    const latLong = await getLatLong(text);
    setOriginLatLong(latLong);
    setOriginLoading(false);
    await UpdateJourneys(latLong, destinationLatLong);
    setMarker(1, latLong);
    if(destinationInputValid){
      console.log("Fitting markers");
      fitMarkers();
    } else {
      moveToLocation(latLong);
    }
  }
  function toggleItem(id) {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }
  async function UpdateJourneys(origin, destination){
    console.log("Attempting to update journeys using origin:" + originLatLong + " and destination:" + destinationLatLong)
    if(origin == null) { 
      console.log("Can't update journey due to origin")
      return; 
    }
    if(destination == null) { 
      console.log("Can't update journey due to destination")
      return; }
    if(selectedDays.length === 0) { 
      console.log("Can't update journey due to no selected days")
      return; 
    }
    if(!validateArrivalTime(arrivalTime)) { 
      console.log("Can't update journey due to arrival time")
      return; }
    console.log("Updating Journeys")
    const journeys = await Commute.getAllUniqueJourneys(origin, destination, arrivalTime, selectedDays);
    let currentJourneyFound = false;
    for (const journey of journeys) {
      if(Commute.buildJourneyId(journey) == journeyId ){
        currentJourneyFound = true;
        break;
      }
    }
    console.log("current j found: " +currentJourneyFound)
    if(!currentJourneyFound){setJourneyId(null)}
    setJourneys(journeys);
  }

  return (
    
    <>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() =>
          {
             router.replace("/home")
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
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <CustomInput name="Nickname:" placeholder="Give your commute a name" value={name} onChangeText={setName} inputValid={validateCommuteName(name)} />
      <CustomInput
        name="Origin:"
        placeholder="Where do you start?"
        value={origin}
        onChangeText={ async (text) => {
          setOrigin(text);
        }}
        inputValid={originInputValid}
      />
      <CustomInput
        name="Destination:"
        placeholder="Where are you headed?"
        value={destination}
        onChangeText={ async (text) => {
          await setDestination(text);
        }}
        inputValid={destinationInputValid}
      />
      <CustomInput
        name="Time:"
        placeholder="What time do you arrive?"
        value={arrivalTime}
        onChangeText={ async (text) => {
          setArrivalTime(text);
          await UpdateJourneys(originLatLong,destinationLatLong);
        }}
        inputValid={validateArrivalTime(arrivalTime)}
      />

        {commuteIdToDelete ? (

          <CustomInput
            name="Duration:"
            placeholder="How long does this usually take?"
            value={duration}
            onChangeText={
              (text) => {
                setDuration(parseInt(text));
              }}
            inputValid={validateAverageDuration(duration)}
          />

        ) : null}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', padding:"10" }}>
        {days.map((item) => (
          <Pressable
            key={item.id}
            onPress={async () => {
              toggleItem(item.id);
              await UpdateJourneys(originLatLong,destinationLatLong);
            }}
            style={[commuteTestStyles.daysButton, selectedDays.includes(item.id) && commuteTestStyles.selectedDay]}
          >
            <Text style={commuteTestStyles.dayText}>{item.name}</Text>
          </Pressable>
        ))}
      </View>
        <View style={{ maxHeight: 300, alignItems: "center" }} >
        <FlatList
          data={journeys}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <JourneyButton journey={item} journeyId={journeyId} setJourneyId={setJourneyId} />
          )}
        />
        </View>
        <View style={{ alignItems: "center", padding: 10 }}>
          <Button
            title="View Possible Journeys"
            onPress={async () => {
              setJourneys(await Commute.getAllUniqueJourneys(originLatLong, destinationLatLong, arrivalTime, selectedDays));
            }}
          />
          <Button
            title="Submit"
            onPress={() => {
              removeCommute(commuteIdToDelete);
              removeCommuteFromFirestore(commuteIdToDelete);
              const newCommute = new Commute(name, origin, originLatLong, destination, destinationLatLong, arrivalTime, selectedDays, journeyId, parseInt(duration, 10));
              newCommute.init();
              setLoadedCommute(newCommute);
            }}
          />
          {commuteIdToDelete ? (
            <Button
              title="Delete"
              onPress={() => {
                removeCommute(commuteIdToDelete);
                removeCommuteFromFirestore(commuteIdToDelete);
              }}
            />
          ) : null}
          {commuteIdToDelete ? (
            <Button
              title="Check for delays today"
              onPress={async () => {
                await loadedCommute.checkForDelay(new Date());
              }}
            />
          ) : null}

        </View>
      </ScrollView>
      </BottomSheet>
    </>
  );
}

function CustomInput({ name, placeholder, value, onChangeText, inputValid }) {
  return (
    <View style={{ width: "100%", alignItems: "center" }}>
    <Text style={commuteTestStyles.journeyButtonText}>{name}</Text>
    <TextInput
      style={inputValid ? commuteTestStyles.input : commuteTestStyles.input_invalid}
      placeholder={placeholder}
      placeholderTextColor="grey"
      value={value}
      onChangeText={onChangeText}
    />
    </View>
  );
}
function JourneyButton({ journey, journeyId, onPress }) {
  const id = Commute.buildJourneyId(journey);
  return (
    <View style={id === journeyId ? commuteTestStyles.journeyButtonSelected : commuteTestStyles.journeyButton}>
      <Pressable
        onPress={() => {
          onPress(id);
        }}
      >
        <Text style={commuteTestStyles.journeyButtonText}>
          {journey.legs.map((leg) => leg.instruction.summary).join("\n")}
        </Text>
      </Pressable>
    </View>
  );
}
function BuildCommuteObject(params) {
  if (params.commuteId != undefined) {
    let loadedCommute = new Commute(params.name,
      params.origin, params.originLatLong,
      params.destination, params.destinationLatLong,
      params.arrivalTime, JSON.parse(params.days), params.journeyId,
      params.duration, params.commuteId);
    return loadedCommute
  }
  return new Commute("", "", "", "", "", "", [], "", 0, "");
}
