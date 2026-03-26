import { useEffect, useState } from "react";
import { DEFAULT_FILTERS } from "../filters.default";
import { Search, Filter } from 'lucide-react';

function FilterPanel({ filters, setFilters, onApply }) {

    function updateFilter(name, value) {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function resetFilters() {
        setFilters(DEFAULT_FILTERS);
    }

    useEffect(() => {
        if (!filters.hasNutrition) {
            setFilters(prev => ({
                ...prev,
                minKcal: null,
                maxKcal: null,
                minProtein: null,
                maxProtein: null,
                minCarbs: null,
                maxCarbs: null,
                minFat: null,
                maxFat: null,
            }));
        }
    }, [filters.hasNutrition]);

    const [showFilters, setShowFilters] = useState(false);
    
    return(
        <>
            <div className="searchBar">
                <input
                    value={filters.search}
                    onChange={e => updateFilter("search", e.target.value)}
                    placeholder="Nazwa przepisu, składnik, autor..." />

                <button onClick={onApply}>
                    <Search size={20} color="#888" className="searchIcon" />
                </button>

                <button onClick={() => setShowFilters(f => !f)}>
                    <Filter size={18} />
                </button>

            </div>

            {showFilters && (
            <div className="filters">
                <div className="filters-left">
                    <div className="filtersInputWrapper">
                        <label>Ocena (1 do 5)</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.minRating ?? ""}
                            onChange={e => updateFilter("minRating", e.target.value)}
                            placeholder="Min"  />

                        <input
                            type="number"
                            min="0"
                            value={filters.maxRating ?? ""}
                            onChange={e => updateFilter("maxRating", e.target.value)} 
                            placeholder="Max" />
                    </div>

                    <div className="filtersInputWrapper">
                        <label>Ilość ocen</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.minOpinionCount ?? ""}
                            onChange={e => updateFilter("minOpinionCount", e.target.value)} 
                            placeholder="Min" />

                        <input
                            type="number"
                            min="0"
                            value={filters.maxOpinionCount ?? ""}
                            onChange={e => updateFilter("maxOpinionCount", e.target.value)} 
                            placeholder="Max" />
                    </div>

                    <div className="macroCheckbox">
                        <label>Podane makroskładniki</label>
                        <input
                            type="checkbox"
                            checked={filters.hasNutrition}
                            onChange={e => updateFilter("hasNutrition", e.target.checked)} />
                    </div>

                    <div className="filtersInputWrapper">
                        <label>Kalorie</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.minKcal ?? ""}
                            disabled={!filters.hasNutrition}
                            onChange={e => updateFilter("minKcal", e.target.value)} 
                            placeholder="Min"/>

                        <input
                            type="number"
                            min="0"
                            value={filters.maxKcal ?? ""}
                            disabled={!filters.hasNutrition}
                            onChange={e => updateFilter("maxKcal", e.target.value)}
                            placeholder="Max" />
                    </div>

                    <div className="filtersInputWrapper">
                        <label>Białko</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.minProtein ?? ""}
                            disabled={!filters.hasNutrition}
                            onChange={e => updateFilter("minProtein", e.target.value)}
                            placeholder="Min" />

                        <input
                            type="number"
                            min="0"
                            value={filters.maxProtein ?? ""}
                            disabled={!filters.hasNutrition}
                            onChange={e => updateFilter("maxProtein", e.target.value)} 
                            placeholder="Max" />
                    </div>

                    <div className="filtersInputWrapper">
                        <label>Węglowodany</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.minCarbs ?? ""}
                            disabled={!filters.hasNutrition}
                            onChange={e => updateFilter("minCarbs", e.target.value)}
                            placeholder="Min" />

                        <input
                            type="number"
                            min="0"
                            value={filters.maxCarbs ?? ""}
                            disabled={!filters.hasNutrition}
                            onChange={e => updateFilter("maxCarbs", e.target.value)}
                            placeholder="Max" />
                    </div>

                    <div className="filtersInputWrapper">
                        <label>Tłuszcz</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.minFat ?? ""}
                            disabled={!filters.hasNutrition}
                            onChange={e => updateFilter("minFat", e.target.value)}
                            placeholder="Min" />

                        <input
                            type="number"
                            min="0"
                            value={filters.maxFat ?? ""}
                            disabled={!filters.hasNutrition}
                            onChange={e => updateFilter("maxFat", e.target.value)}
                            placeholder="Max" />
                    </div>
                </div>

                <div className="filters-right">
                    <div className="filterGroup">
                        <label>
                            <input
                            type="radio"
                            name="ratingOrder"
                            checked={filters.order === "desc"}
                            onChange={() => updateFilter("order", "desc")}
                            />
                            Malejąco
                        </label>

                        <label>
                            <input
                            type="radio"
                            name="ratingOrder"
                            checked={filters.order === "asc"}
                            onChange={() => updateFilter("order", "asc")}
                            />
                            Rosnąco
                        </label>
                    </div>
                

                    <div className="filterGroup">
                        <label>
                            Sortuj według:
                            <select
                                value={filters.orderBy}
                                onChange={e => updateFilter("orderBy", e.target.value)}
                            >
                            <option value="recipeId">Data przesłania</option>
                            <option value="rating">Ocena</option>
                            <option value="opinionamount">Ilość ocen</option>
                            </select>
                        </label>
                    </div>

                    <div className="filterButtons">
                        <button onClick={onApply}>
                            Zastosuj
                        </button>
                        <button onClick={resetFilters}>
                            Resetuj filtry
                        </button>
                    </div>
                </div>
            </div> )}
        </>
    );

}

export default FilterPanel