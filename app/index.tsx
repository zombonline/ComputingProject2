import { Text, View, Button } from "react-native";
//imported button component from react native library
import { testFunctionForReactButton } from './utils/commute';
//imported a function I made in my own js class so the button can call the function.
export default function Index() {
  return (
    <View
      style={{
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "#33333E",
      }}
    >
    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", paddingHorizontal: 40, marginBottom: 40 }}>
      <Button title="Login" onPress={testFunctionForReactButton} color={"#DC9F85"}/>
      <Button title="Sign Up" onPress={testFunctionForReactButton} color={"#DC9F85"}/>
      </View>
    </View>
  );
}
