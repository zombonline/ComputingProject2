import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { getAllUniqueCommutes, validateLocation, validateArrivalTime } from './utils/commute';

export default function CommuteTestScreen() {
  const [origin, setOrigin] = useState(""); 
  const [destination, setDestination] = useState(""); 
  const [arrivalTime, setArrivalTime] = useState(""); 
  const [instructions, setInstructions] = useState(""); 
  const [originValid, setOriginValid] = useState(false);
  const [destinationValid, setDestinationValid] = useState(false);
  const [arrivalTimeValid, setArrivalTimeValid] = useState(false);
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
        setOriginValid(await validateLocation(text));
       }} />
      <Text style={{ color: "white" }}> {String(originValid)} </Text>
      <CustomInput placeholder="Where are you headed?" value={destination} onChangeText={async (text) => 
      {
        setDestination(text);
        setDestinationValid(await validateLocation(text));
       }} />
      <Text style={{ color: "white" }}> {String(destinationValid)} </Text>
      <CustomInput placeholder="What time do you arrive?" value={arrivalTime} onChangeText={async (text) => 
      {
        setArrivalTime(text);
        setArrivalTimeValid(await validateArrivalTime(text));
       }} />
      <Text style={{ color: "white" }}> {String(arrivalTimeValid)} </Text>
      <Text style={{ color: "white" }}>  {instructions} </Text>
    <Button title="View Possible Journeys" onPress={async ()=> {setInstructions(await getAllUniqueCommutes(origin, destination, arrivalTime, [0,1,2,3]))}} />
    </View>
  );

}
// Reusable TextInput component
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

