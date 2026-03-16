function PageManager({ page, setPage, pageSize, setPageSize, hasNext, totalPages }) {
    return (
        <div className="pageManager">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page===1}>←</button>
            <span>Strona {page}/{totalPages}</span>
            <button 
                onClick={() => setPage(p => p + 1)}
                disabled={!hasNext}>→</button>

            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
            </select>
        </div>
    );
}

export default PageManager;