// components/BottomSheet.jsx
import React, { useRef, useEffect } from "react";
import {
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function BottomSheet({ halfHeight = SCREEN_HEIGHT * 0.5, onDismiss, onModeChange, children }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const FULL_OPEN_Y = 0;
  const HALF_OPEN_Y = SCREEN_HEIGHT - halfHeight;
  const CLOSED_Y = SCREEN_HEIGHT;
  let lastOffset = 0;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderGrant: () => {
        translateY.stopAnimation((value) => {
          lastOffset = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = lastOffset + gestureState.dy;
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { moveY } = gestureState;
        if (moveY > SCREEN_HEIGHT * 0.85) {
          snapTo(CLOSED_Y, () => {
            onDismiss && onDismiss();
          });
        } else if (moveY < SCREEN_HEIGHT / 2) {
          snapTo(FULL_OPEN_Y, () => {
            onModeChange && onModeChange("full");
          });
        } else {
          snapTo(HALF_OPEN_Y, () => {
            onModeChange && onModeChange("half");
          });
        }
      },
    })
  ).current;

  const snapTo = (toValue, callback) => {
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: false,
      bounciness: 6,
    }).start(callback);
  };

  useEffect(() => {
    snapTo(HALF_OPEN_Y, () => {
      onModeChange && onModeChange("half");
    });
  }, []);

  const toggleSheet = () => {
    translateY.stopAnimation((currentValue) => {
      if (currentValue < (HALF_OPEN_Y + FULL_OPEN_Y) / 2) {
        snapTo(HALF_OPEN_Y, () => {
          onModeChange && onModeChange("half");
        });
      } else {
        snapTo(FULL_OPEN_Y, () => {
          onModeChange && onModeChange("full");
        });
      }
    });
  };

  return (
    <Animated.View
    style={[styles.sheetContainer, { transform: [{ translateY }] }]}
    {...panResponder.panHandlers}
  >
    <TouchableOpacity style={styles.arrowContainer} onPress={toggleSheet}>
      <Ionicons name="chevron-up" size={24} color="#fff" />
    </TouchableOpacity>
    <View style={styles.contentContainer}>
      <ScrollView>
        {children}
      </ScrollView>
    </View>
  </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: "#33333e",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    zIndex:1

  },
  arrowContainer: {
    alignItems: "center",
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});

