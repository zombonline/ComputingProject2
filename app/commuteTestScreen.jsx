import { Text, View, Button, TextInput, ScrollView, Pressable, FlatList,Dimensions } from "react-native";
import { useState } from "react";
import { validateArrivalTime, validateCommuteName } from "./utils/input_validation";
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
  const params = useLocalSearchParams();
  const loadedCommute = LoadCommute(params);
// #region input variables
  const [name, setName] = useState(loadedCommute.name || "");
  const [origin, setOrigin] = useDebouncedState(loadedCommute.origin || "", 500, async (text) => {
    setOriginLatLong(await getLatLong(text));
  });
  const [originLatLong, setOriginLatLong] = useState(loadedCommute.originLatLong || "");
  const [destination, setDestination] = useDebouncedState(loadedCommute.destination || "", 500, async (text) => {
    setDestinationLatLong(await getLatLong(text));
  });
  const [destinationLatLong, setDestinationLatLong] = useState(loadedCommute.destinationLatLong || "");
  const [arrivalTime, setArrivalTime] = useState(loadedCommute.arrivalTime || "");
  const [selectedDays, setSelectedDays] = useState(loadedCommute.days || []);
  const [journeyId, setJourneyId] = useState(loadedCommute.journeyId || "");
  const [duration, setDuration] = useState(loadedCommute.duration || 0);
  const [commuteIdToDelete, setCommuteIdToDelete] = useState(loadedCommute.commuteId || "");
  const [arrivalTimeValid, setArrivalTimeValid] = useState(false);
  const [journeys, setJourneys] = useState([]);
  const [commute, setCommute] = useState();
  const days = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
    { id: 0, name: "Sunday" },
  ];
// #endregion

  const toggleItem = (id) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <View style={commuteTestStyles.container}>
        <BottomSheet
                halfHeight={SCREEN_HEIGHT * 0.5}
                onDismiss={() => router.replace("/home")}
                onModeChange={(newMode) => {
                  console.log("Commutes mode updated to:", newMode);
                }}
              >
        <CustomInput placeholder="Give your commute a name" value={name} onChangeText={setName} inputValid={validateCommuteName(name)} />
        <CustomInput placeholder="Where do you start?" value={origin}
        onChangeText={setOrigin}
        inputValid={originLatLong!=null}
        />
        <CustomInput placeholder="Where are you headed?"
         value={destination}
         onChangeText={setDestination}
         inputValid={destinationLatLong!=null}
         />
        <CustomInput
          placeholder="What time do you arrive?"
          value={arrivalTime}
          onChangeText={(text) => {
            setArrivalTime(text);
            console.log("valid? " + validateArrivalTime(text));
          }}
          inputValid={validateArrivalTime(arrivalTime)}
        />
        {commuteIdToDelete ? (
              <CustomInput
                placeholder="Usual Journey Duration"
                value={duration}
                onChangeText={
                    (text) => {
                        setDuration(parseInt(text));
                        console.log(typeof duration);
                    }}
              />
            ) : null }
        <Text style={{ color: "white" }}>{String(arrivalTimeValid)}</Text>
        <FlatList
          data={days}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => toggleItem(item.id)}>
              <Text style={{ color: "white" }}>
                {selectedDays.includes(item.id) ? "☑️" : "⬜"} {item.name}
              </Text>
            </Pressable>
          )}
        />
      <View style={{maxHeight:300}} >
      <ScrollView style={commuteTestStyles.scrollView}>
        <View style={{ alignItems: "center", padding:10 }}>
          {journeys.map((journey, index) => (
            <JourneyButton key={index} journey={journey} setJourneyId={setJourneyId} />
          ))}
        </View>
      </ScrollView>
      </View>
      <View style={{ alignItems: "center", padding:10 }}>
        <Button
          title="View Possible Journeys"
          onPress={async () => {
            const v = await Commute.getAllUniqueJourneys(originLatLong, destinationLatLong, arrivalTime, selectedDays);
            setJourneys(v);
          }}
        />
        <Button
          title="Submit"
          onPress={() => {
            removeCommute(commuteIdToDelete);
            const newCommute = new Commute(name, origin, originLatLong, destination, destinationLatLong, arrivalTime, selectedDays, journeyId, parseInt(duration, 10));
            newCommute.init();
            setCommute(newCommute);
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

function CustomInput({ placeholder, value, onChangeText, inputValid }) {
  console.log("Input validation:", inputValid);
  return (
    <TextInput
      style={inputValid ? commuteTestStyles.input : commuteTestStyles.input_invalid}
      placeholder={placeholder}
      placeholderTextColor="grey"
      value={value}
      onChangeText={onChangeText}
    />
  );
}

function JourneyButton({ journey, setJourneyId }) {
  return (
    <View style={commuteTestStyles.journeyButton}>
      <Pressable
        onPress={() => {
          const newId = Commute.buildJourneyId(journey);
          setJourneyId(newId);
        }}
      >
        <Text style={commuteTestStyles.journeyButtonText}>
          {journey.legs.map((leg) => leg.instruction.summary).join("\n")}
        </Text>
      </Pressable>
    </View>
  );
}

function LoadCommute(params){
  let loadedCommute;
  if(params.commuteId != undefined){
    loadedCommute = new Commute(params.name,
       params.origin, params.originLatLong,
        params.destination, params.destinationLatLong,
         params.arrivalTime, JSON.parse(params.days), params.journeyId,
          params.duration, params.commuteId);
  }
  return loadedCommute;
}
