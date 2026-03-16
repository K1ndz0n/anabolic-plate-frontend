import { useState } from "react"
import ApiService from "../ApiService";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleLogin = async (e) => {
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


    return(
        <div className="form">
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

            <button onClick={() => handleLogin()}
                disabled={email === "" || password === ""}>Zaloguj</button>
            <p>lub</p>
            <button onClick={() => navigate("/register")}>Zarejestruj się</button>

            {error && <p className="errorMessage">{error}</p>}
        </div>
    );
}

export default Login