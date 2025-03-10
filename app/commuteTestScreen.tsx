import { Text, View, Button, TextInput, ScrollView, Pressable, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import { Commute } from "./utils/commute";
import { validateArrivalTime, getLatLong } from "./utils/input_validation";

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
    <View style={styles.container}>
      <CustomInput
        placeholder="Where do you start?"
        value={origin}
        onChangeText={async (text) => {
            setOrigin(text);
            setOriginLatLong(await getLatLong(text));
        }}

      />
      <Text style={styles.text}>{String(originLatLong)}</Text>
      <CustomInput
        placeholder="Where are you headed?"
        value={destination}
        onChangeText={async (text) => {
          setDestination(text);
          const latLong = await getLatLong(text);
          setDestinationLatLong(latLong);
        }}
      />
      <Text style={styles.text}>{String(destinationLatLong)}</Text>
      <CustomInput
        placeholder="What time do you arrive?"
        value={arrivalTime}
        onChangeText={async (text) => {
          setArrivalTime(text);
          setArrivalTimeValid(await validateArrivalTime(text));
        }}
      />
      <Text style={styles.text}>{String(arrivalTimeValid)}</Text>
      <Text style={styles.text}>{instructions}</Text>
      <FlatList
        data={days}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleItem(item.id)}>
            <Text style={styles.text}>
              {selectedDays.includes(item.id) ? "☑️" : "⬜"} {item.name}
            </Text>
          </Pressable>
        )}
      />
      <ScrollView style={styles.scrollView}>
        <View style={{ alignItems: "center" }}>
          {journeys.map((journey, index) => (
            <JourneyButton key={index} journey={journey} setJourneyID={setJourneyID} />
          ))}
        </View>
      </ScrollView>
      <Button
        title="View Possible Journeys"
        onPress={async () => {
          setJourneys(await getAllUniqueCommutes(originLatLong, destinationLatLong, arrivalTime, selectedDays));
        }}
      />
      <Button
        title="Submit"
        onPress={() => setCommute(new Commute(originLatLong, destinationLatLong, arrivalTime, selectedDays, journeyID))}
      />
    </View>
  );
}

function CustomInput({ placeholder, value, onChangeText }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="grey"
      value={value}
      onChangeText={onChangeText}
    />
  );
}

function JourneyButton({ journey, setJourneyID }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={styles.button}
        onPress={() => {
          const newID = buildJourneyID(journey);
          setJourneyID(newID);
        }}
      >
        <Text style={styles.buttonText}>
          {journey.legs.map((leg) => leg.instruction.summary).join("\n")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#33333E",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginTop: 18,
    borderColor: "grey",
    color: "white",
  },
  text: {
    color: "white",
  },
  scrollView: {
    width: "90%",
    margin: 20,
    borderWidth: 1,
  },
  buttonContainer: {
    borderRadius: 10,
    backgroundColor: "red",
    padding: 10,
    width: "90%",
    marginTop: 10,
    borderColor: "grey",
  },
  button: {
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});
