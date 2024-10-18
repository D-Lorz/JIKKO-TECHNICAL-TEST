/**
 * Función que recibe una lista de enteros y un entero de destino,
 * y devuelva los índices de los dos números que sumados dan el resultado.
 * 
 * @param {number[]} numList - Un array de números enteros.
 * @param {number} target - El valor objetivo que se desea alcanzar.
 */
const sumIndices = (numList, target) => {
    const seenIndices = {}; // Objeto para almacenar los índices de los números que ya se han visto
    let result = null;

    // Iterar sobre el array usando some para interrumpir al encontrar un par
    numList.some((num, index) => {
        // Calcular el valor necesario para alcanzar el objetivo
        const neededValue = target - num;

        // Verificar si el valor necesario ya ha sido visto
        if (seenIndices[neededValue] !== undefined) {
            // Guardar los índices del par y detener la búsqueda
            result = [seenIndices[neededValue], index];
            return true;
        }
        // Si no se encuentra, almacena el índice del número actual
        seenIndices[num] = index;
        return false;
    });

    // Retornar los índices encontrados o null si no hay coincidencias
    return result;
};

const testSumIndices = (testCases) => {
    testCases.map(({ numList, target }) => {
        const result = sumIndices(numList, target);
        console.log(`Para la lista ${JSON.stringify(numList)} y el objetivo ${target}, los índices son: ${result}`);
    });
};

// Listas de números y objetivos a probar
const testCases = [
    { numList: [2, 7, 11, 15], target: 12 },    // null => No hay coincidencias
    { numList: [3, 2, 4], target: 7 },          // Indices => 0, 2
    { numList: [1, 5, 14, 3, 8], target: 8 },   // Indices => 1, 3
    { numList: [4, 6], target: 11 },            // null => No hay coincidencias
];

testSumIndices(testCases);
