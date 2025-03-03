import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import { useState } from "react";

export default function CommuteTestScreen() {
    const input1 = textInput()
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
    {input1.render()}
    <Button title="hello" onPress={()=> {console.log(input1.value)}} > </Button>
    </View>

  );

}
  export function textInput(){
    const [value, setValue] = useState(""); // Define state inside function
    return {
        render: () => {
            return (<TextInput
                placeholder="Enter Your name"
                value = {value}
                onChange ={setValue}
                />)
            getValue = ()=> {value}
            }
        }
}


