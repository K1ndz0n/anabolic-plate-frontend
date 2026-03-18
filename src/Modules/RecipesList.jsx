import { useEffect, useState } from "react";
import Thumbnail from "../Modules/Thumbnail";
import FilterPanel from "../Modules/FIlterPanel";
import { DEFAULT_FILTERS } from "../filters.default";
import PageManager from "../Modules/PageManager";
import LoaderComponent from "./LoaderComponent";

function RecipesList({ fetchFunction, isUserPage }) {
    const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
    const [filters, setFilters] = useState(draftFilters);
    const [data, setData] = useState({ items: [], totalCount: 0 });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    const [isComponentLoaded, setIsComponentLoaded] = useState(false);
    const [recipesLoaded, setRecipesLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setRecipesLoaded(false);

        fetchFunction({
            ...filters,
            page,
            pageSize
        }).then(responseData => {
            if (isMounted) {
                setData(responseData);
                setRecipesLoaded(true);
                setIsComponentLoaded(true);
            }
        }).catch(err => {
            console.error(err);
            if (isMounted) setRecipesLoaded(true);
        });

        return () => { isMounted = false; };
    }, [filters, page, pageSize, fetchFunction]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    function applyFilters() {
        setFilters({ ...draftFilters }); 
        setPage(1);
    }

    if (!isComponentLoaded) {
        return (<LoaderComponent />);
    }

    return (
        <div className="appContent">
            {data.totalCount > 0 && <FilterPanel
                filters={draftFilters}
                setFilters={setDraftFilters}
                onApply={applyFilters}/>}
            
            <div>
                {recipesLoaded ? (
                    data.items?.length > 0 ? (
                        data.items.map(d => (
                            <Thumbnail key={d.recipeId} thumbnail={d} isUserPage={isUserPage} />
                        ))
                    ) : (
                        <p style={{marginTop: "200px"}} className="noContentInfo">Brak przepisów</p>
                    )
                ) : (<LoaderComponent />)}

                {data.itemsCount > 0 && recipesLoaded && (
                    <PageManager
                        page={page}
                        setPage={setPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        hasNext={data.hasNext}
                        totalPages={data.totalPages}/>
                )}
            </div>
        </div>
    );
}

export default RecipesList