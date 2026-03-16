export default class Units {
    static UNITS_PL = {
        0: "g",
        1: "ml",
        2: "sztuka",
        3: "łyżeczka",
        4: "łyżka",
        5: "szklanka",
        6: "szczypta"
    };

    /**
     * Zamienia numer (ID) na nazwę jednostki (np. 0 -> "g")
     */
    static unitIdToPL(unitId) {
        return this.UNITS_PL[unitId] ?? "Nieznana jednostka";
    }

    /**
     * Zamienia nazwę jednostki na numer (np. "g" -> 0)
     * Przydatne przy zapisywaniu danych do bazy/stanu
     */
    static stringToUnitId(unitString) {
        const entry = Object.entries(this.UNITS_PL).find(
            ([id, name]) => name.toLowerCase() === unitString?.toLowerCase()
        );
        return entry ? parseInt(entry[0]) : null;
    }
}