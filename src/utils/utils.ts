export const generateId = (): string => crypto.randomUUID();

export const sortArrayAlphabeticallyByProp = <T>(arr: T[], prop: keyof T): T[] => {
	const arrCopy = [...arr];
	arrCopy.sort(function (a, b) {
		if (a[prop] < b[prop]) {
			return -1;
		}
		if (a[prop] > b[prop]) {
			return 1;
		}
		return 0;
	});
	return arrCopy;
};
