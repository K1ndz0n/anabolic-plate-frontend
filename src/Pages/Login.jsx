import { useState, useRef } from "react"
import ApiService from "../ApiService";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../Modules/LoadingButton";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");
    const buttonRef = useRef(null);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            setError("Wpisz poprawny email");
            return;
        }
        try {
            setError("");
            const data = await ApiService.postLoginData(email, password);
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            buttonRef.current?.click();
        }
    }


    return(
        <div className="form" onKeyDown={(e) => handleKeyDown(e)}>
            <input 
                type="text"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)} />
            <input 
                type={showPassword ? "text" : "password"}
                placeholder="hasło"
                onChange={(e) => setPassword(e.target.value)} />

            <div className="showPasswordRow">
                <label>Pokaż hasło</label>
                <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={e => setShowPassword(e.target.checked)}
                />
            </div>

            <LoadingButton
                ref={buttonRef}
                disabled={email === "" || password === ""}
                text={"Zaloguj"}
                onClick={() => handleLogin()} />

            <p>lub</p>
            <button
                onClick={() => navigate("/register")}>Zarejestruj się</button>

            {error && <p className="errorMessage">{error}</p>}
        </div>
    );
}

export default Login