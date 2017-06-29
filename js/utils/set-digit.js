/**
  * Разбивает число на разряды
  * 
  * @param {number} number — число
  * @param {number} fixed - количество знаков после запятой
 * @return Разбитое на разряды число.
  */

const numberSplitRegex = /\B(?=(\d{3})+(?!\d))/g;

export default function (number, fractionalDigits = 2) {
	const str = number.toFixed(fractionalDigits);

	if (fractionalDigits > 0) {
        const [int, frac] = str.split(".");
		const formattedInc = int.replace(numberSplitRegex, " ");
		return `${formattedInc}.${frac}`;
	}

	return str.replace(numberSplitRegex, " ");
};
