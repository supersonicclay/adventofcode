

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

races = inputRaces;

let totalWays = 1;
for (const {time, distance} of races) {
    let ways = 0;
    for (let holdDuration = 1; holdDuration <= time; holdDuration++) {
        let distanceTravelled = 0;
        let speed = 0;
        for (let t = 0; t < time; t++) {
            if (t < holdDuration) {
                speed++;
            } else {
                distanceTravelled += speed;
            }
        }
        if (distanceTravelled > distance) {
            ways++;
        }

        console.log(`HOLD: ${holdDuration}, DISTANCE: ${distanceTravelled}`);
    }
    console.log(`WAYS: ${ways}`);
    totalWays *= ways;
}

console.log(totalWays);
