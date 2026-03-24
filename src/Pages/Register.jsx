import { useState, useRef } from "react";
import ApiService from "../ApiService";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import LoadingButton from "../Modules/LoadingButton";

function validatePassword(password) {
    if (password.length < 6) {
        return "Hasło musi mieć co najmniej 6 znaków";
    }

    if (!/[a-z]/.test(password)) {
        return "Hasło musi zawierać małą literę (a-z)";
    }

    if (!/[A-Z]/.test(password)) {
        return "Hasło musi zawierać dużą literę (A-Z)";
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        return "Hasło musi zawierać co najmniej jeden znak specjalny";
    }

    return "";
}

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");
    const buttonRef = useRef(null);

    const recaptchaRef = useRef();
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            buttonRef.current?.click();
        }
    }

    const handleRegister = async (e) => {
        if (!validateEmail(email)) {
            setError("Wpisz poprawny email");
            return;
        }

        if (validatePassword(password) !== "") {
            setError(validatePassword(password));
            return;
        }

        try {
            setError("");
            await ApiService.postRegisterData(username, email, password, recaptchaToken);
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
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} 
                onKeyDown={(e) => handleKeyDown(e)} />
            <input 
                type="text"
                placeholder="Nazwa użytkownika"
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)} />
            <input 
                type={showPassword ? "text" : "password"}
                placeholder="hasło"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)} />

            <div className="showPasswordRow">
                <label>Pokaż hasło</label>
                <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={e => setShowPassword(e.target.checked)}
                />
            </div>

            <input 
                type="password"
                placeholder="Potwierdź hasło"
                className={
                    password !== confirmPassword && confirmPassword.length > 0
                    ? "confirmPassword error"
                    : "confirmPassword"
                }
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)} />
            <div className="captchaWrapper">
                <ReCAPTCHA
                    sitekey="6LcmgYgsAAAAAMKFAhPObj9P2WVOalldBgqejlsl"
                    ref={recaptchaRef}
                    onChange={() => setRecaptchaToken(recaptchaRef.current.getValue())} 
                />
            </div>
            
            <LoadingButton
                ref={buttonRef}
                text={"Zarejestruj się"}
                disabled={email === "" || password === "" 
                    || confirmPassword === "" || password !== confirmPassword
                    || !recaptchaToken}
                onClick={() => handleRegister()} />

            <p>Posiadasz konto?</p>
            <button onClick={() => navigate("/login")}>Zaloguj się</button>

            {error && <p className="errorMessage">{error}</p>}
        </div>
    );
}

export default Register