import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Units from "../Units";
import LoadingButton from "./LoadingButton";

function AddRecipePanel({ fetchFunction, recipeDetails }) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [ingredientsValid, setIngredientsValid] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [steps, setSteps] = useState([""]);
    const inputRefs = useRef([]);

    const [ingredients, setIngredients] = useState([{ name: "", amount: 0, unit: 0 }]);
    
    const addIngredient = () => {
        setIngredients([...ingredients, { name: "", amount: 0, unit: 0 }]);
    };

    const updateIngretientName = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index].name = value;
        setIngredients(newIngredients);
    }

    const updateIngretientAmount = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index].amount = value;
        setIngredients(newIngredients);
    }

    const updateIngretientUnit = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index].unit = value;
        setIngredients(newIngredients);
    }

    const deleteIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (ingredients.length === 0) {
            setIngredientsValid(false);
            return;
        }

        const hasInvalidIngredient = ingredients.some(
            ingredient => ingredient.name.trim() === "" || Number(ingredient.amount) <= 0
                || Number(ingredient.amount) > 9999
        );

        setIngredientsValid(!hasInvalidIngredient);
    }, [ingredients]);

    const handleChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const addStep = (index) => {
        const newSteps = [...steps];
        newSteps.splice(index + 1, 0, "");
        setSteps(newSteps);
    }

    const deleteStep = (index) => {
        const newSteps = steps.filter((_, i) => i !== index);
        setSteps(newSteps);
    }

    useEffect(() => {
        if (recipeDetails) {
            setName(recipeDetails.name);

            if (recipeDetails.description) {
                setDescription(recipeDetails.description);
            }
            
            if (recipeDetails.steps) {
                setSteps(recipeDetails.steps.split('\n'));
            }

            const newIngredients = recipeDetails.ingredients.map(i => ({
                name: i.name,
                amount: i.amount,
                unit: i.unit
            }));

            setIngredients(newIngredients);
        }
    }, [recipeDetails]);

    const handleKeyDown = (index, e) => {
        if (e.key === "Enter") {
            e.preventDefault(); 
 
            addStep(index);

            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 0);
        }

        if (e.key === "Backspace" && steps[index] === "" && steps.length > 1) {
            e.preventDefault();
            
            deleteStep(index);

            setTimeout(() => {
                const prevIndex = index > 0 ? index - 1 : 0;
                const prevInput = inputRefs.current[prevIndex];

                if (prevInput) {
                    prevInput.focus();
                    
                    const length = prevInput.value.length;
                    prevInput.setSelectionRange(length, length);
                }
            }, 0);
        }

        if (e.key === "ArrowUp" && index > 0) {
            const nextInput = inputRefs.current[index - 1];
            const length = nextInput.value.length;
            
            nextInput.focus();
            nextInput.setSelectionRange(length, length);
        }

        if (e.key === "ArrowDown" && index < steps.length - 1) {
            const nextInput = inputRefs.current[index + 1];
            const length = nextInput.value.length;

            nextInput.focus();
            nextInput.setSelectionRange(length, length);
        }
    };

    const handlePaste = (index, e) => {
        const pastedData = e.clipboardData.getData('Text');

        if (pastedData.includes('\n')) {
            e.preventDefault();
            pasteSteps(pastedData, index);
        }
    };

    const pasteSteps = (pastedData, index) => {
        const pastedSteps = pastedData
            .split('\n')
            .map(step => step.trim())
            .filter(step => step !== "");

        if (pastedSteps.length > 0) {
            const newSteps = [...steps];
        
            newSteps.splice(index, 1, ...pastedSteps);
            setSteps(newSteps);

            setTimeout(() => {
                const lastPastedIndex = index + pastedSteps.length - 1;
                const nextInput = inputRefs.current[lastPastedIndex];

                if (nextInput) {
                    nextInput.focus();

                    const length = nextInput.value.length;
                    nextInput.setSelectionRange(length, length);
                }
            }, 0);
        }
    }

    const handleRequest = async () => {
        if (name.length > 100) {
            setError("Za długa nazwa (max 100 znaków)");
            return;
        }

        if (description.length > 255) {
            setError("Za długi opis (max 255 znaków)");
            return;
        }

        const stepsData = steps.filter(step => step.trim() !== "").join('\n');
        if (stepsData.length > 3000) {
            setError("Za długa instrukcja przygotowania (max 3000 znaków)");
            return;
        }

        const hasInvalidIngredient = ingredients.some(
            ingredient => ingredient.name.length > 50
        );

        if (hasInvalidIngredient) {
            setError("Jeden ze składników ma za długą nazwę (max 50 znaków)");
            return;
        }

        const data = {
            name: name,
            description: description || null, 
            steps: stepsData || null,
            ingredients: ingredients.map(ingredient => ({
                name: ingredient.name,
                amount: parseFloat(ingredient.amount),
                unit: ingredient.unit
            }))
        };

        const token = localStorage.getItem("token");

        try {
            setError("");
            const response = await fetchFunction(data, token);
            navigate(`/recipes/${response.id}`);
        } catch (err) {
            setError(err.message);
        }
    }

    return(
        <div className="form">
            <div className="formField">
                <label style={{ color: "#666", fontSize: "14px" }}>Nazwa</label>
                <textarea
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>

            <div className="formField">
                <label style={{ color: "#666", fontSize: "14px" }}>Opis</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>

            <div className="addRecipeWrapper">
                <div className="addRecipeHalf">
                    <div className="addRecipeItems">
                        <p style={{margin: "5px", fontSize: "25px"}}>Składniki (min. 1)</p>
                        <ul>
                            {ingredients.map((ingredient, index) => (
                                <li key={index}>
                                    <input
                                        type="text"
                                        value={ingredient.name}
                                        onChange={e => updateIngretientName(index, e.target.value)}
                                        placeholder="Nazwa składnika" />
                                    <input
                                        type="number"
                                        min={0}
                                        max={9999}
                                        value={ingredient.amount}
                                        onChange={e => updateIngretientAmount(index, e.target.value)}
                                        placeholder="Ilość" />

                                    <select
                                        value={ingredient.unit} 
                                        onChange={(e) => updateIngretientUnit(index, Number(e.target.value))}>
                                            {Object.entries(Units.UNITS_PL).map(([id, name]) => (
                                                <option key={id} value={id}>
                                                    {name}
                                                </option>
                                            ))}
                                    </select>
                                    <button onClick={() => deleteIngredient(index)}>Usuń</button>
                                </li>   
                            ))}
                        </ul>
                        <button onClick={() => addIngredient()}>
                            + Nowy składnik
                        </button>
                    </div>
                </div>
                

                <div className="addRecipeHalf">
                    <div className="addRecipeItems">
                        <p style={{margin: "5px", fontSize: "25px", textAlign: "center"}}>Instrukcja przygotowania (opcjonalnie)</p>
                        <ul>
                            {steps.map((step, index) => (
                                <li key={index}>
                                    <textarea
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        value={step}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={(e) => handlePaste(index, e)}
                                        placeholder="Wpisz krok i naciśnij Enter..."
                                    />
                                    <button onClick={() => deleteStep(index)}>Usuń</button>
                                </li>   
                            ))}
                        </ul>
                        <button onClick={() => addStep(steps.length - 1)}>+ Nowy krok</button>
                    </div>      
                </div>
            </div>

            <LoadingButton
                text={recipeDetails ? "Zapisz przepis" : "Dodaj przepis"}
                disabled={name === "" || !ingredientsValid}
                onClick={() => handleRequest()} />

            {error && <p className="errorMessage">{error}</p>}
        </div>
    );
}

export default AddRecipePanel;