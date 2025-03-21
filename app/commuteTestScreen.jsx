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
  const [origin, setOrigin] = useDebouncedState(params.origin || "", 500, async (text) => {
    setOriginLatLong(await getLatLong(text));
  });
  const [originLatLong, setOriginLatLong] = useState(params.originLatLong || "");
  const [destination, setDestination] = useDebouncedState(params.destination || "", 500, async (text) => {
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
    { id: 1, name: "Mon" },
    { id: 2, name: "Tue" },
    { id: 3, name: "Wed" },
    { id: 4, name: "Thu" },
    { id: 5, name: "Fri" },
    { id: 6, name: "Sat" },
    { id: 0, name: "Sun" },
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
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {days.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => toggleItem(item.id)}
            style={[commuteTestStyles.daysButton, selectedDays.includes(item.id) && commuteTestStyles.selectedDay]}
          >
            <Text style={commuteTestStyles.dayText}>{item.name}</Text>
          </Pressable>
        ))}
      </View>
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
        <Pressable style={commuteTestStyles.startButton} onPress={async () => {
          const v = await Commute.getAllUniqueJourneys(originLatLong, destinationLatLong, arrivalTime, selectedDays);
          setJourneys(v);
        }}>
          <Text style={commuteTestStyles.startButtonText}>View Possible Journeys</Text>
        </Pressable>
        <Pressable style={commuteTestStyles.startButton} onPress={() => {
          removeCommute(commuteIdToDelete);
          const newCommute = new Commute(name, origin, originLatLong, destination, destinationLatLong, arrivalTime, selectedDays, journeyId);
          newCommute.init();
          setCommute(newCommute);
        }}>
          <Text style={commuteTestStyles.startButtonText}>Save Commute</Text>
        </Pressable>
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
      <Pressable onPress={() => {
        const newId = Commute.buildJourneyId(journey);
        setJourneyId(newId);
      }}>
        <Text style={commuteTestStyles.journeyButtonText}>
          {journey.legs.map((leg) => leg.instruction.summary).join("\n")}
        </Text>
      </Pressable>
    </View>
  );
}
