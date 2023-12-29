export class UIUtility {
	public static cloneObject<T>(obj: T): T {
		return JSON.parse(JSON.stringify(obj));
	}

	public static cloneObjectWithoutId<T>(obj: T): T {
		const cloned = UIUtility.cloneObject(obj);
		Reflect.deleteProperty(cloned as any, 'id');
		return cloned;
	}
}