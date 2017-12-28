export class StorageService {

    public static getValue(key: string) {
        if (!localStorage.getItem(key)) return null;
        try {
            return JSON.parse(localStorage.getItem(key)!);
        } catch (ex) {
            return null;
        }
    }

    public static setValue(key: string, value: any): any {
        localStorage.setItem(key, JSON.stringify(value));
        return value;
    }

    public static removeValue(key: string): void {
        try {
            localStorage.removeItem(key);
        }
        catch (ex) {

        }
    }


    public static get jwt(): string {
        return StorageService.getValue("jwt") || '';
    }

    public static set jwt(value: string) {
        StorageService.setValue("jwt", value);
    }
}