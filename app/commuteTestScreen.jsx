import { Text, View, Button, TextInput, ScrollView, Pressable, FlatList, Dimensions } from "react-native";
import { useState } from "react";
import { validateArrivalTime, validateCommuteName, validateAverageDuration } from "./utils/input_validation";
import { getLatLong, getDateYYYYMMDD } from "./utils/helperFunctions";
import { commuteTestStyles } from "./style";
import Commute from "./utils/commute";
import { useLocalSearchParams } from "expo-router";
import { removeCommute, removeCommuteFromFirestore } from "./utils/accountStorage";
import useDebouncedState from "./utils/useDebouncedState";
import * as Notifications from "expo-notifications";
import BottomSheet from "../components/BottomSheet";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CommuteTestScreen() {
  const [refresh, setRefresh] = useState(false);
  const localSearchParams = useLocalSearchParams();
  const [loadedCommute, setLoadedCommute] = useState(() => LoadCommute(localSearchParams));
  // #region input variables
  const [name, setName] = useState(loadedCommute.name || "");
  const [origin, setOrigin] = useDebouncedState(loadedCommute.origin || "", 500, async (text) => {
    setOriginLoading(true); 
    const latLong = await getLatLong(text);
    setOriginLatLong(latLong);
    setOriginLoading(false); 
    await UpdateJourneys(latLong,destinationLatLong);
    setTimeout(() => setRefresh(prev => !prev), 5000);
  });
  const [originLatLong, setOriginLatLong] = useState(loadedCommute.originLatLong || "");
  const [destination, setDestination] = useDebouncedState(loadedCommute.destination || "", 500, async (text) => {
    setDestinationLoading(true); 
    const latLong = await getLatLong(text);
    setDestinationLatLong(latLong);
    setDestinationLoading(false); 
    await UpdateJourneys(originLatLong,latLong);
    setTimeout(() => setRefresh(prev => !prev), 50000);
  });
  const [destinationLatLong, setDestinationLatLong] = useState(loadedCommute.destinationLatLong || "");
  const [originLoading, setOriginLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const originInputValid = !originLoading && originLatLong != null;
  const destinationInputValid = !destinationLoading && destinationLatLong != null;

  const [arrivalTime, setArrivalTime] = useState(loadedCommute.arrivalTime || "");
  const [selectedDays, setSelectedDays] = useState(loadedCommute.days || []);
  const [journeyId, setJourneyId] = useState(loadedCommute.journeyId || "");
  const [duration, setDuration] = useState(loadedCommute.duration || 0);
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
  // #endregion

  const toggleItem = (id) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
    setRefresh(prev => !prev); 
    console.log("REFRESHING")
  }

  return (
    <View style={commuteTestStyles.container}>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
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
          extraData={refresh}
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
                console.log("Checking for delays today...");
                const todaysDuration = await Commute.getJourneyDuration(originLatLong, destinationLatLong, arrivalTime, getDateYYYYMMDD(new Date()), journeyId);
                const delay = todaysDuration - duration
                console.log("Delay:", delay);
                Notifications.presentNotificationAsync({
                  title: "Your commute is delayed!",
                  body: "Your usual commute is delayed by " + delay + " minutes.",
                  data: { delay },
                });
              }}
            />
          ) : null}

        </View>


      </BottomSheet>
    </View>
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

function JourneyButton({ journey, journeyId, setJourneyId }) {
  const id = Commute.buildJourneyId(journey);
  return (
    <View style={id === journeyId ? commuteTestStyles.journeyButtonSelected : commuteTestStyles.journeyButton}>
      <Pressable
        onPress={() => {
          setJourneyId(id);
        }}
      >
        <Text style={commuteTestStyles.journeyButtonText}>
          {journey.legs.map((leg) => leg.instruction.summary).join("\n")}
        </Text>
      </Pressable>
    </View>
  );
}

function LoadCommute(params) {
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
