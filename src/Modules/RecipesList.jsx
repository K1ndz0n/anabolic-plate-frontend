import { useEffect, useState } from "react";
import Thumbnail from "../Modules/Thumbnail";
import FilterPanel from "../Modules/FIlterPanel";
import { DEFAULT_FILTERS } from "../filters.default";
import PageManager from "../Modules/PageManager";
import { ClipLoader } from "react-spinners";

function RecipesList({ fetchFunction, isUserPage }) {
    const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

    const [filters, setFilters] = useState(draftFilters);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetchFunction({
            ...filters,
            page,
            pageSize
        }).then(data => {
            setData(data);
            setIsLoaded(true);
        });
    }, [filters, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    function applyFilters() {
        setFilters(draftFilters);
        setPage(1);
    }

    if (!isLoaded) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', marginTop: "10px"}}>
                    <ClipLoader color="white" size={50} />
                </div>
                <p className="noContentInfo">Ładowanie zawartości...</p>
            </div>)
    }

    return (
        <div className="appContent">
            {data.totalCount > 0
            && <FilterPanel
                    filters={draftFilters}
                    setFilters={setDraftFilters}
                    onApply={applyFilters}/>}
            
            <div>
                {data.items?.map(d => (
                    <Thumbnail key={d.recipeId} thumbnail={d} isUserPage={isUserPage} />
                ))}

                {data.itemsCount > 0 && isLoaded
                ? <PageManager
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    hasNext={data.hasNext}
                    totalPages={data.totalPages}/>
                : <p className="noContentInfo">Brak przepisów</p>}
                
            </div>
        </div>
    );
}

export default RecipesList