
import React from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import Commute from '../app/utils/commute'
import { journeyButtonStyles } from '../app/style'
const modeImages = {
    bus: require('../assets/images/mode_bus.png'),
    overground: require('../assets/images/mode_overground.png'),
    tube: require('../assets/images/mode_tube.png'),
    elizabeth: require('../assets/images/mode_elizabeth.png'),
    dlr: require('../assets/images/mode_dlr.png'),
  };
const selected = journeyButtonStyles.selected;
const unselected = journeyButtonStyles.unselected; 

export default function JourneyButton({journey, journeyId, setJourneyId}) {
  const filteredLegs = journey.legs.filter((leg) => leg.mode.id !== "walking");
  const id = Commute.buildJourneyId(journey);
    return (
      <View style={id === journeyId ? {...selected, alignItems: 'center'} : {...unselected, alignItems: 'center'}}>
      <Pressable
          onPress={() => {
            if(setJourneyId== undefined) return;
            setJourneyId(id);
          }}
        >
        <View style={{width:"90%", justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
        {
          filteredLegs.map((leg) => {
            const imageSource = modeImages[leg.mode.id.split("-")[0]];
            return (
                <View style={{width:"30%",  justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 5,paddingHorizontal: 3}}>
                <Text style={{fontSize: 8, textAlign: 'center', paddingHorizontal:1}}>{leg.departurePoint.commonName}</Text>
                <Image source={imageSource} style={{width: "15%", aspectRatio: 1, paddingHorizontal:3}} resizeMode="contain"/>
                </View>
            );
        })}
        <Text style={{fontSize: 8, textAlign: 'center', paddingHorizontal:10}}>{filteredLegs[filteredLegs.length-1].arrivalPoint.commonName}</Text>
        </View>
        </Pressable>
      </View>
    );
  }