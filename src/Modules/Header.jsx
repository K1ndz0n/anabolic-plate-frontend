import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../ApiService";

function Header() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");
    const [userData, setUserData] = useState();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/")
    }

    useEffect(() => {
        if (isLoggedIn) {
            ApiService.getLoggedUser(localStorage.getItem("token"))
                .then(setUserData);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return ( 
        <header className="header">
            <div className="logo" onClick={() => navigate("/")}>
                <img src="/logo.png" />
            </div>

            <div className="navRight">
                {!isLoggedIn ? (
                    <>
                        <span className="navItem" onClick={() => navigate("/login")}>
                            Zaloguj się
                        </span>
                        <span className="navItem muted" onClick={() => navigate("/register")}>
                            Zarejestruj się
                        </span>
                    </>
                ) : (
                    <>
                        <span className="navItem" onClick={handleLogout}>
                            Wyloguj
                        </span>
                    
                        <div className="userMenu" ref={menuRef}>
                            <span
                                className="navItem"
                                onClick={() => setMenuOpen(prev => !prev)}
                            >
                                {userData?.username} ⌄
                            </span>

                            {menuOpen && (
                                <div className="userDropdown">
                                    <button onClick={() => {navigate(`/user/${userData?.username}`);
                                                            setMenuOpen(false)}}>
                                        Mój profil
                                    </button>
                                    <button onClick={() => {navigate("/saved")
                                                            setMenuOpen(false)}}>
                                        Zapisane przepisy
                                    </button>
                                    <button onClick={() => {navigate("/followed")
                                                            setMenuOpen(false)}}>
                                        Przepisy od obserwowanych twórców
                                    </button>
                                </div>
                            )}
                        </div>

                        <span
                            className="navItem cta"
                            onClick={() => navigate("/add-recipe")}
                        >
                            + Dodaj przepis
                        </span>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header
