import { FaGithub } from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer">
            <p style={{color: "#666"}}>© 2026 AnabolicPlate</p>

                <a 
                    href="https://github.com/K1ndz0n"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaGithub color="white" size={25} />
                </a>
        </footer>
    );
}

export default Footer