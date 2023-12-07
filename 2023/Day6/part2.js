

const exampleRaces = [
    {time: 7, distance: 9},
    {time: 15, distance: 40},
    {time: 30, distance: 200},
];

const inputRaces = [
    {time: 54, distance: 239},
    {time: 70, distance: 1142},
    {time: 82, distance: 1295},
    {time: 75, distance: 1253},
];

const inputRaces2 = [
    {time: 54708275, distance: 239114212951253},
];

races = inputRaces2;

let totalWays = 1;
for (const {time, distance} of races) {
    let ways = 0;
    for (let holdDuration = 1; holdDuration <= time; holdDuration++) {
        const speed = holdDuration;
        const distanceTravelled = time*speed - speed*speed;
        if (distanceTravelled > distance) {
            ways++;
        }

        if (holdDuration %1000 === 0) {
            console.log(`SPEED: ${speed}, HOLD: ${holdDuration}, TIME: ${time}, DISTANCE: ${distanceTravelled}`);
        }
    }
    console.log(`WAYS: ${ways}`);
    totalWays *= ways;
}

console.log(`TOTAL WAYS: ${totalWays}`);
