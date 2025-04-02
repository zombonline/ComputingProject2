import React from "react";
import { Text, TextInput, View } from "react-native";
import { customInputStyle } from "@/app/style";
import { errorTextStyle } from "@/app/style";

export default function CustomInput({
  name,
  placeholder,
  value,
  onChangeText,
  errorCheck,
  width,
}) {
  return (
    <View style={{ width: width, alignItems: "center" }}>
      <Text style={{ color: "white" }}>{name}</Text>
      <TextInput
        style={
          errorCheck.valid
            ? customInputStyle.input
            : customInputStyle.input_invalid
        }
        placeholder={placeholder}
        placeholderTextColor="grey"
        value={value}
        onChangeText={onChangeText}
        height={"40"}
      />
      <Text style={errorTextStyle}>{errorCheck.errorMessage}</Text>
    </View>
  );
}