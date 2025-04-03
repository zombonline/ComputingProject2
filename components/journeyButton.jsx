import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Commute from "../app/utils/commute";
import { journeyButtonStyles, textStyles} from "../app/style";
const modeImages = {
  bus: require("../assets/images/mode_bus.png"),
  overground: require("../assets/images/mode_overground.png"),
  tube: require("../assets/images/mode_tube.png"),
  elizabeth: require("../assets/images/mode_elizabeth.png"),
  dlr: require("../assets/images/mode_dlr.png"),
};
const selected = journeyButtonStyles.selected;
const unselected = journeyButtonStyles.unselected;

export default function JourneyButton({ journey, journeyId, setJourneyId }) {
  const filteredLegs = journey.legs.filter((leg) => leg.mode.id !== "walking");
  const id = Commute.buildJourneyId(journey);
  return (
    <View
      style={
        id === journeyId
          ? { ...selected, alignItems: "center" }
          : { ...unselected, alignItems: "center" }
      }
    >
      <Pressable
        onPress={() => {
          if (setJourneyId == undefined) return;
          setJourneyId(id);
        }}
      >
        <View
          style={{
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {filteredLegs.map((leg) => {
            const imageSource = modeImages[leg.mode.id.split("-")[0]];
            return (
              <View
                style={{
                  width: "90%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 3,
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    ...textStyles.blackStandardStyle,
                    width:"45%",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  {leg.departurePoint.commonName}
                </Text>
                <Image
                  source={imageSource}
                  style={{ width: "10%", aspectRatio: 1, resizeMode: "contain" }}
                />
                <Text
                  style={{
                    ...textStyles.blackStandardStyle,
                    width:"45%",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  {leg.arrivalPoint.commonName}
                </Text>
              </View>
              
            );
          })}
          
        </View>
      </Pressable>
    </View>
  );
}
