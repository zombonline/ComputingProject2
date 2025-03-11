import { Text, View, Button, TextInput, ScrollView, Pressable, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import { getAllUniqueJourneys, buildJourneyID } from "./utils/commute";
import { validateArrivalTime } from "./utils/input_validation";
import { getLatLong } from "./utils/helperFunctions"
import { commuteTestStyles } from "./style";
import Commute from "./utils/commute";

export default function CommuteTestScreen() {
  const [origin, setOrigin] = useState("");
  const [originLatLong, setOriginLatLong] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationLatLong, setDestinationLatLong] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [arrivalTimeValid, setArrivalTimeValid] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [journeyID, setJourneyID] = useState("");
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

  const toggleItem = (id) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <View style={commuteTestStyles.container}>
    <ScrollView style={commuteTestStyles.scrollView}>
    <CustomInput
        placeholder="Where do you start?"
        value={origin}
        onChangeText={async (text) => {
            setOrigin(text);
            setOriginLatLong(await getLatLong(text));
        }}
      />
      <Text style={{ color: "white" }}> {String(originLatLong)} </Text>
      <CustomInput
        placeholder="Where are you headed?"
        value={destination}
        onChangeText={async (text) => {
          setDestination(text);
          setDestinationLatLong(await getLatLong(text));
        }}
      />
      <Text style={{ color: "white" }}> {String(destinationLatLong)} </Text>
      <CustomInput
        placeholder="What time do you arrive?"
        value={arrivalTime}
        onChangeText={(text) => {
          setArrivalTime(text);
          setArrivalTimeValid(validateArrivalTime(text));
        }}
      />
      <Text style={{ color: "white" }}>{String(arrivalTimeValid)}</Text>
      <Text style={{ color: "white" }}>{instructions}</Text>
      <FlatList
        data={days}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleItem(item.id)}>
            <Text style={{color: "white"}}>
              {selectedDays.includes(item.id) ? "☑️" : "⬜"} {item.name}
            </Text>
          </Pressable>
        )}
      />
      <ScrollView style={commuteTestStyles.scrollView}>
        <View style={{ alignItems: "center" }}>
          {journeys.map((journey, index) => (
            <JourneyButton key={index} journey={journey} setJourneyID={setJourneyID} />
          ))}
        </View>
      </ScrollView>
      <Button
        title="View Possible Journeys"
        onPress={async () => {
            console.log("i try")
            const v = await Commute.getAllUniqueJourneys(originLatLong, destinationLatLong, arrivalTime, selectedDays);
          console.log("Hello")
          setJourneys(v);
        }}
      />
      <Button
        title="Submit"
        onPress={() => {
            const newCommute = new Commute(originLatLong, destinationLatLong, arrivalTime, selectedDays, journeyID);
            newCommute.init();
            setCommute(newCommute)}}

      />
      </ScrollView>
      <Text style={{ color: "white" }}>{String(commute)}</Text>
    </View>
  );
}

function CustomInput({ placeholder, value, onChangeText }) {
  return (
    <TextInput
      style={commuteTestStyles.input}
      placeholder={placeholder}
      placeholderTextColor="grey"
      value={value}
      onChangeText={onChangeText}
    />
  );
}

function JourneyButton({ journey, setJourneyID }) {
  return (
       <View style={commuteTestStyles.journeyButton}>
       <Pressable
        onPress={() => {
          const newID = Commute.buildJourneyID(journey);
          setJourneyID(newID);
        }}
      >
       <Text style={commuteTestStyles.journeyButtonText}>
        {journey.legs.map((leg) => leg.instruction.summary).join("\n")}
        </Text>
      </Pressable>
    </View>
  );
}
