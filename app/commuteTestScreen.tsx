import { Text, View, Button, TextInput } from "react-native";
export default function CommuteTestScreen() {
  return (
    <View
      style={{
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "#33333E",
      }}
    >
    <TextInput
                placeholder="Enter Your name"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
    <Button title="hello"> </Button>
    </View>

  );

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

}

