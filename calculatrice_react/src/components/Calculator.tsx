import React, { useEffect, useState } from "react";
import "../styles/Calculator.css";

const Calculator: React.FC = () => {
    const [displayValue, setDisplayValue] = useState("0");
    const [firstOperand, setFirstOperand] = useState<string | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    const handleButtonClick = (value: string) => {
        if (!isNaN(Number(value))) {
            // Si c'est un chiffre
            setDisplayValue((prev) =>
                waitingForSecondOperand ? value : prev === "0" ? value : prev + value
            );
            setWaitingForSecondOperand(false);
        } else if (value === ".") {
            // Gestion des nombres décimaux
            if (!displayValue.includes(".")) {
              setDisplayValue((prev) => prev + ".");
            }
        } else if (["+", "-", "*", "/"].includes(value)) {
            // Si c'est un opérateur
            setFirstOperand(displayValue);
            setOperator(value);
            setWaitingForSecondOperand(true);
        } else if (value === "=") {
            // Si l'utilisateur appuie sur =
            if (firstOperand !== null && operator) {
                const result = calculateResult(parseFloat(firstOperand), parseFloat(displayValue), operator);
                setDisplayValue(result.toString());
                setFirstOperand(null);
                setOperator(null);
                setWaitingForSecondOperand(false);
            }
        } else if (value === "C") {
            // Réinitialiser la calculatrice
            setDisplayValue("0");
            setFirstOperand(null);
            setOperator(null);
            setWaitingForSecondOperand(false);
        }else if (value === "+/-") {
            // Inverser le signe du nombre affiché
            setDisplayValue((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
        }
    };
  
    const calculateResult = (num1: number, num2: number, op: string): number => {
        switch (op) {
            case "+": return num1 + num2;
            case "-": return num1 - num2;
            case "*": return num1 * num2;
            case "/": return num2 !== 0 ? num1 / num2 : 0;
            default: return num2;
        }
    };

    return (
    <div className={`calculator-container ${isDarkMode ? "dark" : ""}`}>
        <button className="btn-toggle-dark" onClick={toggleDarkMode}>
            {isDarkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
        </button>
        {/* Écran d'affichage */}
        <div className="affichage">{displayValue}</div>

        {/* Boutons */}
        <div className="buttons-grid">
            {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".","+/-", "+", "C"].map((btn) => (
            <button key={btn} className={`btn ${btn === "0" ? "btn-zero" : ""} ${btn === "+/-" ? "btn-sign" : ""}`} onClick={() => handleButtonClick(btn)}>

                {btn}
            </button>
            
            ))}
            <button className="btn btn-equal" onClick={() => handleButtonClick("=")}>=</button>
        </div>
    </div>
    );
};

export default Calculator;
