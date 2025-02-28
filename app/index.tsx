import { Text, View, Button } from "react-native";
//imported button component from react native library
import { testFunctionForReactButton } from './utils/commute';
//imported a function I made in my own js class so the button can call the function.
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Hey guys, I'm a button." onPress ={testFunctionForReactButton}></Button>
      //added a button just like we would in html
    </View>
  );
}
