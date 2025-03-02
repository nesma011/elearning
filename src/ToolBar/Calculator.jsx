import { useState } from "react";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState("");
  const [isOpen , setIsopen] =useState(true)

  const handleClick = (value) => {
    if (value === "=") {
      try {
        const result = eval(input).toString();
        setHistory(`${input} = ${result}`);
        setInput(result);
      } catch {
        setInput("Error");
        setHistory("Error");
      }
    } else if (value === "C") {
      setInput("");
      setHistory("");
    } else if (value === "⌫") {
      setInput(input.slice(0, -1));
    } else if (value === "½") {
      try {
        const result = (eval(input) / 2).toString();
        setInput(result);
      } catch {
        setInput("Error");
      }
    } else if (value === "x²") {
      try {
        const result = (eval(input) ** 2).toString();
        setInput(result);
      } catch {
        setInput("Error");
      }
    } else if (value === "√") {
      try {
        const result = Math.sqrt(eval(input)).toString();
        setInput(result);
      } catch {
        setInput("Error");
      }
    } else {
      setInput(input + value);
    }
    
    if (value !== "=" && value !== "C" && value !== "⌫") {
      setTimeout(() => {
        onClose();
      }, 300); // Add a small delay so the user can see the result
    }
  };

  const buttons = [
    "½", "x²", "√", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "00", "0", ".", "=",
    "C", "⌫"
  ];

  return (
   <>
   {isOpen && (
     <div className=" bg-black  flex items-center justify-center">
     <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-80 h-auto">
       <div className="mb-4 flex justify-between items-center">
         <h2 className="text-white text-xl font-semibold">Calculator</h2>
         <button 
           onClick={()=> setIsopen(false)}
           className="text-gray-400 hover:text-white transition-colors"
         >
           ✕
         </button>
       </div>
    
       <div className="bg-gray-800 rounded-lg p-4 mb-4">
         <div className="text-gray-400 text-sm h-6 mb-2 text-right">
           {history}
         </div>
         <input
           type="text"
           value={input}
           readOnly
           className="w-full bg-transparent text-white text-right text-2xl font-semibold focus:outline-none"
         />
       </div>
       
       <div className="grid grid-cols-4 gap-2">
         {buttons.map((btn) => (
           <button
             key={btn}
             onClick={() => handleClick(btn)}
             className={`
               p-4 rounded-lg text-lg font-medium transition-all
               ${btn === "=" 
                 ? "bg-blue-600 hover:bg-blue-700 text-white" 
                 : btn === "C" || btn === "⌫" || btn === "½" || btn === "x²" || btn === "√" || btn === "/" || btn === "*" || btn === "-" || btn === "+" 
                   ? "bg-gray-700 text-blue-400 hover:bg-gray-600" 
                   : "bg-gray-800 text-white hover:bg-gray-700"}
               ${(btn === "C" || btn === "⌫") ? "col-span-1" : ""}
             `}
           >
             {btn}
           </button>
         ))}
       </div>
     </div>
   </div>
   )}
   </>
  );
};

export default Calculator;