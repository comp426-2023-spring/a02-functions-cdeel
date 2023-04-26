#!/usr/bin/env node
import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));
var timezone = moment.tz.guess;


if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0);
  }

if (args.z) {
    timezone = args.z
}

var latitude;
if (args.n) {
    latitude = args.n;
} else {
    latitude = args.s * -1;
}

var longitude;
if(args.e) {
    longitude = args.e;
}
else {
   longitude = args.w * -1;
}

var urlFinal = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&timezone=" + timezone + "&daily=precipitation_hours");
const data = await urlFinal.json();

if(args.j) {
    console.log(data);
    process.exit(0);
}

var days = args.d;
if (args.d == null) {
    days = 1;
}

if (days == 0) {
	if(data.daily.precipitation_hours[0] > 0) {
	 	console.log("You might need your galoshes");	
	}  else{
	    console.log("You will not need your galoshes");
	}
    console.log("today.");
}else if (days > 1) {
	if(data.daily.precipitation_hours[days] > 0) {
		console.log("You might need your galoshes");
	} else{
	    console.log("You will not need your galoshes")
	} 
    console.log("in " + days + " days.");
} else { 
	if(data.daily.precipitation_hours[1] > 0) {
		console.log("You might need your galoshes");
	} else{
		console.log("You will not need your galoshes");
	}
    console.log("tomorrow.");
}