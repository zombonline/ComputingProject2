import { Text, View, Button, TextInput, ScrollView, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { getAllUniqueJourneys, buildJourneyId } from "./utils/commute";
import { validateArrivalTime } from "./utils/input_validation";
import { getLatLong } from "./utils/helperFunctions";
import { commuteTestStyles } from "./style";
import Commute from "./utils/commute";
import { useLocalSearchParams } from "expo-router";
import { removeCommute } from "./utils/accountStorage";
import useDebouncedState from "./utils/useDebouncedState";

export default function CommuteTestScreen() {
  const params = useLocalSearchParams();
  const [name, setName] = useState(params.name || "");
  const [origin, setOrigin] = useDebouncedState("", 500, async (text) => {
    setOriginLatLong(await getLatLong(text));
  });
  const [originLatLong, setOriginLatLong] = useState(params.originLatLong || "");
  const [destination, setDestination] = useDebouncedState("", 500, async (text) => {
    setDestinationLatLong(await getLatLong(text));
  });
  const [destinationLatLong, setDestinationLatLong] = useState(params.destinationLatLong || "");
  const [arrivalTime, setArrivalTime] = useState(params.arrivalTime || "");
  const [selectedDays, setSelectedDays] = useState(params.days ? JSON.parse(params.days) : []);
  const [journeyId, setJourneyId] = useState(params.journeyId || "");
  const [commuteIdToDelete, setCommuteIdToDelete] = useState(params.commuteId || "");
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

  const toggleItem = (id) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <View style={commuteTestStyles.container}>
        <CustomInput placeholder="Give your commute a name" value={name} onChangeText={setName} />
        <CustomInput placeholder="Where do you start?" value={origin} onChangeText={setOrigin} />
        <Text style={{ color: "white" }}> {String(originLatLong)} </Text>
        <CustomInput placeholder="Where are you headed?" value={destination} onChangeText={setDestination} />
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
            const newCommute = new Commute(name, origin, originLatLong, destination, destinationLatLong, arrivalTime, selectedDays, journeyId);
            newCommute.init();
            setCommute(newCommute);
          }}
        />
        </View>
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
