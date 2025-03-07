import { Text, View, Button, TextInput, ScrollView, Pressable, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import { getAllUniqueCommutes, getLatLong } from './utils/commute';
import {validateArrivalTime} from './utils/input_validation';

export default function CommuteTestScreen() {
  const [origin, setOrigin] = useState("");
  const [originLatLong, setOriginLatLong] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationLatLong, setDestinationLatLong] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [instructions, setInstructions] = useState(""); 
  const [originValid, setOriginValid] = useState(false);
  const [destinationValid, setDestinationValid] = useState(false);
  const [arrivalTimeValid, setArrivalTimeValid] = useState(false);
  const days = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
    { id: 0, name: "Sunday" },
  ];
    const [selectedDays, setSelectedDays] = useState([]);
    const [journeys, setJourneys] = useState([]);
  const journey = {"legs":[{"instruction":{"steps":[{"departurePoint":{"commonName":"E16 2FD"},"arrivalPoint":{"commonName":"Gallions Reach DLR Station"}}]}}]};

  const toggleItem = (id) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      },
      input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: "90%",
        marginTop: 18,
        borderColor: "grey",
      },
    });
  return (
    <View
      style={{
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "#33333E",
      }}
    >
      <CustomInput placeholder="Where do you start?" value={origin} onChangeText={async (text) => 
      {
          setOrigin(text);
        const latLong = await getLatLong(text);
        setOriginLatLong(await latLong);
        setOriginValid(await latLong!= null);
       }} />
      <Text style={{ color: "white" }}> {String(originValid)} </Text>
      <CustomInput placeholder="Where are you headed?" value={destination} onChangeText={async (text) => 
      {
        setDestination(text);
        const latLong = await getLatLong(text);
        setDestinationLatLong(await latLong);
        setDestinationValid(await latLong!= null);
       }} />
      <Text style={{ color: "white" }}> {String(destinationValid)} </Text>
      <CustomInput placeholder="What time do you arrive?" value={arrivalTime} onChangeText={async (text) => 
      {
        setArrivalTime(text);
        setArrivalTimeValid(await validateArrivalTime(text));
       }} />
      <Text style={{ color: "white" }}> {String(arrivalTimeValid)} </Text>
      <Text style={{ color: "white" }}>  {instructions} </Text>
      <FlatList
          data={days}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
              <Pressable onPress={() => toggleItem(item.id)}>
              <Text style={{ color: "white" }}>{selectedDays.includes(item.id) ? "☑️" : "⬜"} {item.name}</Text>
              </Pressable>
      )}
      />

      <ScrollView style={{ width: "90%", margin: 20, borderWidth: 1,}}>
        <View style={{ alignItems: "center" }}>
          {journeys.map((journey, index) => (
            <JourneyButton key={index} journey={journey} />
          ))}
        </View>
      </ScrollView>
    <Button title="View Possible Journeys" onPress={async ()=> {setJourneys(await getAllUniqueCommutes(originLatLong, destinationLatLong, arrivalTime, selectedDays))}} />

    </View>
  );

}
function CustomInput({ placeholder, value, onChangeText }) {
  const styles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      width: "90%",
      marginTop: 18,
      borderColor: "grey",
      color: "white",
    },
  });

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

function JourneyButton({journey}){
    const styles = StyleSheet.create({
        container: {
          borderRadius: 10,
          backgroundColor: "red",
          padding: 10,
          width: "90%",
          marginTop: 10,
          borderColor: "grey",
        }});
    return (
       <View style={styles.container}>
             <Pressable style={styles.button} onPress={() => {}}>
               <Text style={styles.buttonText}>
                 {journey.legs.map(leg => leg.instruction.summary).join("\n")}
               </Text>
             </Pressable>
           </View>
     );
        }

