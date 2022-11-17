//Calcul Odds before Deploys 
const calculOdds = () => {
    const teamA = 3.28
    const teamB = 2.32
    const total = teamA + teamB
    const resultA = parseInt(((teamA / total) * 10000).toFixed(0))
    const resultB = parseInt(((teamB / total) * 10000).toFixed(0))
    return [resultA, resultB]

}

const values = calculOdds();

console.log(values[0]);
console.log(values[1]);

// let value = calculOdds();
// console.log(values[0]);
// console.log(values[1]);