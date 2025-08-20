import React, {useState} from 'react'
import * as Location from 'expo-location';

export async function grabUserLocationInfo() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return null;
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log("User Location:", location);
    getRestaurants(location["coords"].latitude, location["coords"].longitude, 5000);
    return location;
}

// Function to get restaurants near a location
async function getRestaurants(lat: number, lon: number, radius: number) {
    const query = `
    [out:json];
    node["amenity"="restaurant"](around:${radius},${lat},${lon});
    out;
    `;

    var result = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
            method: "POST",
            // The body contains the query
            body: "data="+ encodeURIComponent(query),
        },
    ).then(
        (data)=>data.json()
    )

    console.log(JSON.stringify(result, null, 2));
}

