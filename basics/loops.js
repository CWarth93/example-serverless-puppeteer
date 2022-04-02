const asyncForEach = async (array, fn) => {
	for (let index = 0; index < array.length; index++) {
		await fn(array[index], index, array);
	}
};

module.exports = {
	asyncForEach,
};
