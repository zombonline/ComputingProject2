import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { getCommutes } from "./utils/accountStorage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
const router = useRouter(); 

const SavedCommutesTestScreen = () => {
    const [commutes, setCommutes] = useState({});
    const navigation = useNavigation(); 

    useEffect(() => {
        const loadCommutes = async () => {
            const storedCommutes = await getCommutes();
            setCommutes(storedCommutes);
            console.log(Object.keys(storedCommutes).length);
        };
        loadCommutes();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Saved Commutes</Text>
            {Object.keys(commutes).length > 0 ? (
                Object.values(commutes).map((commute, index) => (
                    <Pressable key={index} style={styles.commuteCard}
                    onPress={() => router.push({
                            pathname: "/commuteTestScreen",
                            params: {
                              name: commute.name,
                              origin: commute.origin,
                              originLatLong: commute.originLatLong,
                              destination: commute.destination,
                              destinationLatLong: commute.destinationLatLong,
                              arrivalTime: commute.arrivalTime,
                              days: JSON.stringify(commute.days), // Convert array to string
                              journeyId: commute.journeyId,
                              commuteId: commute.commuteId,
                            },
                          })}>
                        <Text style={styles.text}>Name: {commute.name}</Text>
                        <Text style={styles.text}>From: {commute.origin}</Text>
                        <Text style={styles.text}>From (Lat/Long): {commute.originLatLong}</Text>
                        <Text style={styles.text}>To: {commute.destination}</Text>
                        <Text style={styles.text}>To (Lat/Long): {commute.destinationLatLong}</Text>
                        <Text style={styles.text}>Arrival Time: {commute.arrivalTime}</Text>
                        <Text style={styles.text}>Days: {commute.days.join(", ")}</Text>
                        <Text style={styles.text}>Journey ID: {commute.journeyId}</Text>
                        <Text style={styles.text}>Commute ID: {commute.commuteId}</Text>
                    </Pressable>
                ))
            ) : (
                <Text style={styles.text}>No saved commutes found.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    commuteCard: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    text: {
        fontSize: 16,
    },
});

export default SavedCommutesTestScreen;
