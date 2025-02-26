export function hasFlags<T extends number>(flags: T, requiredFlags: T[]) {
	return requiredFlags.every((flag) => (flags & flag) === flag);
}
