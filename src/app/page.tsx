// "use client";

// import { useState, useEffect } from "react";

// interface Definition {
//   definition: string;
//   example?: string;
// }

// interface Meaning {
//   partOfSpeech: string;
//   definitions: Definition[];
//   synonyms: string[];
// }

// interface WordData {
//   word: string;
//   phonetic?: string;
//   phonetics?: string;
//   meanings: Meaning[];
//   sourceUrls?: string[];
// }

// export default function Dictionary() {
//   const fonts = [
//     { label: "Serif", tailwindClass: "font-serif" },
//     { label: "Sans Serif", tailwindClass: "font-sans" },
//     { label: "Monospace", tailwindClass: "font-mono" }
//   ];
//   // Estados para la búsqueda y los resultados
//   const [searchTerm, setSearchTerm] = useState(""); // Almacena la palabra que el usuario está buscando
//   const [wordData, setWordData] = useState<WordData[]>([]); // Guarda los datos obtenidos de la API
//   const [selectedWord, setSelectedWord] = useState<WordData | null>(null); // Almacena la palabra seleccionada para mostrar detalles

//   // Estados para el control de carga y errores
//   const [loading, setLoading] = useState<boolean>(false); // Indica si la búsqueda está en progreso
//   const [error, setError] = useState<string | null>(null); // Almacena posibles mensajes de error

//   // Estados de UI
//   const [darkMode, setDarkMode] = useState(false); // Controla si el modo oscuro está activado
//   const [currentFont, setCurrentFont] = useState(fonts[0]); // Define la fuente actual seleccionada
//   const [isOpen, setIsOpen] = useState(false); // Maneja el estado del menú de selección de fuentes
//   const [showDropdown, setShowDropdown] = useState(false); // Controla si el dropdown de sugerencias está visible

//   // Estado para optimizar la búsqueda
//   const [debouncedSearch, setDebouncedSearch] = useState(""); // Almacena el término de búsqueda con debounce para evitar múltiples llamadas a la API

//   // Historial de búsqueda
//   const [history, setHistory] = useState<{ word: string; index: number; timestamp: string }[]>([]); // Guarda el historial de palabras buscadas con su índice y timestamp

//   // Control de eventos de búsqueda
//   const [triggeredByEnter, setTriggeredByEnter] = useState(false); // Indica si la búsqueda fue activada presionando "Enter"

//   // Alterna el estado del menú desplegable de selección de fuentes
//   const toggleDropdown = () => setIsOpen(!isOpen);

//   // Cambia la fuente actual y cierra el menú desplegable
//   const selectFont = (font: typeof fonts[number]) => {
//     setCurrentFont(font);
//     setIsOpen(false);
//   };

//   // Manejar la búsqueda en tiempo real
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (value.trim()) {
//       setShowDropdown(true); // Mantiene el dropdown mientras escribe
//     } else {
//       setShowDropdown(false);
//       setWordData([]); // Limpia la data
//       setSelectedWord(null); // Evita que selectedWord mantenga una palabra anterior
//     }
//   };

//   // Maneja la búsqueda cuando el usuario presiona la tecla "Enter"
//   const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       setShowDropdown(false);
//       setTriggeredByEnter(true);
//       const data = await fetchWord(searchTerm.trim());
//       if (data && data.length > 0) {
//         setSelectedWord(data[0]);
//         // Agregar al historial directamente
//         addToHistory(data[0].word, data);
//       }
//     }
//   };

//   /**
//    * Realiza una solicitud a la API del diccionario para obtener definiciones de una palabra.
//    * @param word - La palabra a buscar.
//    * @returns Una lista de objetos `WordData` con las definiciones o `null` si no se encontraron resultados.
//    */
//   const fetchWord = async (word: string): Promise<WordData[] | null> => {
//     const trimmedSearch = word.trim();
//     if (!trimmedSearch) {
//       setError("Please enter a word before searching.");
//       setWordData([]);
//       return null;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedSearch}`);
//       if (!res.ok) throw new Error("No definitions found.");
//       const data: WordData[] = await res.json();
//       if (data.length > 0) {
//         setWordData(data);
//         setError(null);
//         return data; // Retorna los datos para usarlos directamente
//       } else {
//         setError("No definitions found.");
//         setWordData([]);
//         return null;
//       }
//     } catch (err) {
//       setWordData([]);
//       setError(err instanceof Error ? err.message : "An unknown error occurred");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };


//   /**
//    * Agrega una palabra al historial de búsqueda, evitando duplicados y limitando la cantidad de entradas.
//    * @param word - La palabra buscada.
//    * @param wordData - Lista de datos de la palabra obtenida desde la API.
//    * @param specificIndex - (Opcional) Índice específico dentro de `wordData` para registrar en el historial.
//    */
//   const addToHistory = (word: string, wordData: WordData[], specificIndex?: number) => {
//     const index = specificIndex !== undefined
//       ? specificIndex
//       : wordData.findIndex(w => w.word.toLowerCase() === word.toLowerCase());

//     if (index === -1) {
//       return;
//     }

//     setHistory((prevHistory) => {
//       // Verificar si la palabra ya está en el historial con el mismo índice
//       const alreadyExists = prevHistory.some(
//         (h) => h.word.toLowerCase() === word.toLowerCase() && h.index === index
//       );
//       if (alreadyExists) {
//         return prevHistory; // No agregar duplicados con el mismo índice
//       }
//       const newEntry = {
//         word,
//         index,
//         timestamp: new Date().toLocaleString(),
//       };
//       const updatedHistory = [newEntry, ...prevHistory.slice(0, 9)];
//       localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
//       return updatedHistory;
//     });
//   };

//   // Obtener transcripción fonética y audio
//   const phoneticText = Array.isArray(selectedWord?.phonetics)
//     ? selectedWord.phonetics.find((p) => p?.text)?.text || ""
//     : "";
//   const phoneticAudio = Array.isArray(selectedWord?.phonetics)
//     ? selectedWord.phonetics.find((p) => typeof p.audio === "string")?.audio || ""
//     : "";
//   const playAudio = () => {
//     if (phoneticAudio) {
//       new Audio(phoneticAudio).play();
//     }
//   };

//   /**
//    * Aplica el tema oscuro o claro a la aplicación y lo guarda en el almacenamiento local.
//    * Se ejecuta cada vez que cambia el estado `darkMode`.
//    */
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [darkMode]);

//   /**
//    * Aplica un debounce a `searchTerm`, estableciendo un valor retrasado en `debouncedSearch`.
//    * Se ejecuta cada vez que `searchTerm` cambia.
//    */
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchTerm.trim());
//     }, 0); // Esperar 0 ms
//     return () => clearTimeout(handler);
//   }, [searchTerm]);

//   /**
//    * Realiza una búsqueda cuando `debouncedSearch` cambia.
//    * Si `debouncedSearch` está vacío, limpia los resultados y oculta el dropdown.
//    */
//   useEffect(() => {
//     if (debouncedSearch) {
//       fetchWord(debouncedSearch);
//     } else {
//       setWordData([]); // Limpia los resultados si el input está vacío
//       setSelectedWord(null); // Evita que se mantenga una palabra anterior
//       setShowDropdown(false);
//     }
//   }, [debouncedSearch]);

//   /**
//    * Selecciona automáticamente una palabra de `wordData` cuando se actualiza el historial o se realiza una nueva búsqueda.
//    * Se ejecuta cada vez que `wordData`, `triggeredByEnter`, `searchTerm` o `history` cambian.
//    */
//   useEffect(() => {
//     if (wordData.length > 0 && !selectedWord) { // Solo si no hay una palabra seleccionada
//       const lastEntry = history.find(h => h.word.toLowerCase() === searchTerm.toLowerCase());
//       if (lastEntry) {
//         setSelectedWord(wordData[lastEntry.index] || wordData[0]);
//       } else if (triggeredByEnter) {
//         setSelectedWord(wordData[0]);
//       }
//     }
//   }, [wordData, triggeredByEnter, searchTerm, history, JSON.stringify(selectedWord)]);

//   /**
//    * Carga el historial de búsqueda almacenado en `localStorage` cuando el componente se monta.
//    * Se ejecuta solo una vez, ya que el array de dependencias está vacío (`[]`).
//    */
//   useEffect(() => {
//     const savedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
//     setHistory(savedHistory);
//   }, []);

//   return (
//     <div
//       className={`min-h-screen bg-white text-gray-900 flex flex-col items-center  transition-colors duration-300 ${darkMode ? "dark:bg-[#121212]" : ""
//         }`}>
//       {/* Encabezado */}
//       <header className="w-full max-w-lg flex justify-between items-center px-6 py-3 pt-10">
//         {/* Icono del libro */}
//         <div onClick={() => window.location.reload()} className={`cursor-pointer relative w-8 h-8.5 border-2 border-gray-500 rounded-md bg-white  ${darkMode ? "dark:border-gray-300 dark:bg-gray-800" : ""}`}>
//           <div className={`absolute top-2 left-2 w-3 h-0.5 bg-gray-500 ${darkMode ? "dark:bg-gray-300" : ""}`}></div>
//           <div className={`absolute -bottom-0.5 -left-0.5 w-full h-3 border-2 border-gray-500  rounded-l-full bg-white  border-r-white  pl-7 ${darkMode ? "dark:border-gray-300 dark:bg-gray-800 dark:border-r-gray-800" : ""}`}></div>
//         </div>
//         {/* Controles a la derecha */}
//         <div className="flex items-center gap-4">
//           <div className="flex items-center space-x-4">
//             {/* Selector de fuente */}
//             <div className="relative">
//               {/* Botón de selección de fuente */}
//               <div className="flex items-center gap-1">
//                 <span className={`text-gray-700 font-bold ${currentFont.tailwindClass}`}>
//                   {currentFont.label}
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="w-4 h-4 text-purple-500 cursor-pointer"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   onClick={toggleDropdown}>
//                   <path d="M6 9l6 6 6-6" />
//                 </svg>
//               </div>
//               {/* Menú desplegable */}
//               {isOpen && (
//                 <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-50">
//                   {fonts.map((font) => (
//                     <button
//                       key={font.tailwindClass}
//                       className={`block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 cursor-pointer ${font.tailwindClass}`}
//                       onClick={() => selectFont(font)}>
//                       {font.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="h-5 border-l border-[#eeeeee]"></div>
//             {/* Toggle de modo oscuro */}
//             <label className="flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={darkMode}
//                 onChange={() => setDarkMode(!darkMode)} />
//               <div className="w-12 h-6 bg-gray-400 peer-checked:bg-gray-700 rounded-full relative transition">
//                 <div
//                   className={`w-5 h-5 bg-white absolute top-0.5 rounded-full transition-all duration-300 ease-in-out ${darkMode ? "left-6" : "left-1"
//                     }`}></div>
//               </div>
//             </label>
//             {/* Icono de luna */}
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 text-gray-500"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round">
//               <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
//             </svg>
//           </div>
//         </div>
//       </header>
//       {/* Barra de búsqueda */}
//       <div className="w-full max-w-lg p-6 rounded-lg ">
//         <div className="relative">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for a word..."
//               // value={searchTerm}
//               // onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//               className={`w-full h-13 p-4 pr-8 rounded-xl text-lg outline-none bg-[#F4F4F4] text-[#262626] font-bold ${currentFont.tailwindClass}`}
//             />
//             <button
//               onClick={() => fetchWord(searchTerm.trim())}
//               className="absolute right-1 top-1.5 flex items-center justify-center w-10 h-10 bg-transparent text-purple-500 cursor-pointer">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="2"
//                 stroke="currentColor"
//                 className="w-5 h-5">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </button>
//           </div>
//           {/* Dropdown dinámico */}
//           {showDropdown && wordData.length > 0 && (
//             <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 p-4 
//                   max-h-60 overflow-y-auto">
//               {wordData.slice(0, 5).map((word, index) => (
//                 <div
//                   key={index}
//                   className="p-2 border-b last:border-none cursor-pointer hover:bg-gray-100"
//                   onClick={() => {
//                     setSearchTerm(word.word); // Llenar input al hacer clic
//                     setSelectedWord(word); // Guardar palabra seleccionada
//                     setShowDropdown(false); // Ocultar dropdown
//                     // Al seleccionar una palabra del dropdown, guardamos el índice específico
//                     const specificIndex = wordData.findIndex(w => w === word); // Esto usa igualdad por referencia
//                     addToHistory(word.word, wordData, specificIndex); // Pasamos el índice específico
//                   }}>
//                   <h2 className="text-lg font-bold">{word.word}</h2>
//                   {word.meanings.slice(0, 1).map((meaning, idx) => (
//                     <div key={idx}>
//                       <p className="italic text-gray-600">{meaning.partOfSpeech}</p>
//                       <ul className="list-disc list-inside">
//                         {meaning.definitions.slice(0, 1).map((def, i) => (
//                           <li key={i} className="text-gray-800">
//                             {def.definition.length > 10
//                               ? def.definition.substring(0, 50) + "..."
//                               : def.definition}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         {loading && <p className="mt-3 text-gray-600">Loading...</p>}
//         {error && <p className="mt-3 text-red-500">{error}</p>}
//       </div>
//       {/* Lista de producto*/}
//       {history.length > 0 && (
//         <div className="mt-6 w-full max-w-lg p-6 ">
//           <h3 className={`text-lg text-center font-semibold text-[#262626] ${darkMode ? "text-[#ffff]" : ""} ${currentFont.tailwindClass}`}>
//             List of Products
//           </h3>
//           <ul className={`list-disc list-inside mt-2 max-h-48 overflow-auto border p-2 rounded-lg break-all sm:break-normal ${darkMode ? "text-[#ffff] border-white" : "border-black"} sm:max-h-64`}>
//             {history.map((item, index) => (
//               <li key={index} className={`flex items-center gap-1 font-semibold text-[#262626] ${darkMode ? "text-[#ffff]" : ""} ${currentFont.tailwindClass}`}>
//                 <span>•</span>
//                 <button
//                   className="text-purple-500 inline-flex"
//                 >
//                   {item.word}
//                 </button>
//                 <span className="text-xs text-gray-400">({item.timestamp})</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  codigo: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  creacion: Date;
}

export default function ProductApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productQuantity, setProductQuantity] = useState<number | "">("");
  const [errorModal, setErrorModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Maneja el estado del menú de selección de fuentes
  const [loading, setLoading] = useState(true); // Estado de carga
  const [errors, setErrors] = useState<{ name?: string; desc?: string; quantity?: string }>({});
  const [sortBy, setSortBy] = useState<string>("name"); // Estado para el criterio de ordenación
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isOpenSort, setIsOpenSort] = useState(false); // Maneja el estado del menú de selección de sort
  const fonts = [
    { label: "Serif", tailwindClass: "font-serif" },
    { label: "Sans Serif", tailwindClass: "font-sans" },
    { label: "Monospace", tailwindClass: "font-mono" }
  ];
  // Estados de UI
  const [darkMode, setDarkMode] = useState(false); // Controla si el modo oscuro está activado
  const [currentFont, setCurrentFont] = useState(fonts[0]); // Define la fuente actual seleccionada

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Cambia la fuente actual y cierra el menú desplegable
  const selectFont = (font: typeof fonts[number]) => {
    setCurrentFont(font);
    setIsOpen(false);
  };

  // Función para ordenar productos según el criterio seleccionado
  const sortedProducts = [...products].sort((a, b) => {
    let result = 0;

    switch (sortBy) {
      case "code":
        result = a.codigo - b.codigo; // Comparación numérica        break;
      case "name":
        result = a.nombre.localeCompare(b.nombre);
        break;
      case "quantity":
        result = a.cantidad - b.cantidad; // Comparación numérica
        break;
      case "creation":
        result = new Date(a.creacion).getTime() - new Date(b.creacion).getTime(); // Comparación de fechas
        break;
      default:
        break;
    }

    return sortOrder === "asc" ? result : -result;
  });

  /**
   * Aplica el tema oscuro o claro a la aplicación y lo guarda en el almacenamiento local.
   * Se ejecuta cada vez que cambia el estado `darkMode`.
   */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts).map((product: any) => ({
        ...product,
        creacion: new Date(product.creacion), // Convertir a Date
      }));
      setProducts(parsedProducts);
    }
    setLoading(false); // Finaliza la carga después de procesar
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = () => {
    let newErrors: { name?: string; desc?: string; quantity?: string } = {};

    if (!productName.trim()) newErrors.name = "The name is required.";
    if (!productDesc.trim()) newErrors.desc = "The description is required.";
    if (productQuantity === "" || productQuantity <= 0) {
      newErrors.quantity = "The quantity is required.";
    }

    // Si hay errores, los mostramos y detenemos la ejecución
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Verificar si el producto ya existe
    const exists = products.find((product) => product.nombre.toLowerCase() === productName.toLowerCase());
    if (exists) {
      setErrorModal(true);
      return;
    }

    // Si pasa la validación, limpiamos los errores
    setErrors({});

    const newProduct: Product = {
      codigo: Date.now(),
      nombre: productName,
      descripcion: productDesc,
      cantidad: productQuantity === "" ? 1 : productQuantity, // Evita error de asignación
      creacion: new Date(),
    };

    setProducts([...products, newProduct]);
    setProductName("");
    setProductDesc("");
    setProductQuantity(1);
  };

  const removeProduct = (codigo: number) => {
    setProducts(products.filter((product) => product.codigo !== codigo));
  };

  return (
    <div
      className={`min-h-screen bg-white text-gray-900 flex flex-col items-center  transition-colors duration-300 ${darkMode ? "dark:bg-[#121212]" : ""
        }`}>
      {/* Encabezado */}
      <header className="w-full max-w-lg flex justify-between items-center px-6 py-3 pt-10">
        {/* Icono del libro */}
        <div onClick={() => window.location.reload()} className={`cursor-pointer relative w-8 h-8.5 border-2 border-gray-500 rounded-md bg-white  ${darkMode ? "dark:border-gray-300 dark:bg-gray-800" : ""}`}>
          <div className={`absolute top-2 left-2 w-3 h-0.5 bg-gray-500 ${darkMode ? "dark:bg-gray-300" : ""}`}></div>
          <div className={`absolute -bottom-0.5 -left-0.5 w-full h-3 border-2 border-gray-500  rounded-l-full bg-white  border-r-white  pl-7 ${darkMode ? "dark:border-gray-300 dark:bg-gray-800 dark:border-r-gray-800" : ""}`}></div>
        </div>
        {/* Controles a la derecha */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-4">
            {/* Selector de fuente */}
            <div className="relative">
              {/* Botón de selección de fuente */}
              <div className="flex items-center gap-1">
                <span className={`text-gray-700 font-bold ${currentFont.tailwindClass}`}>
                  {currentFont.label}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-purple-500 cursor-pointer"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={toggleDropdown}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              {/* Menú desplegable */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                  {fonts.map((font) => (
                    <button
                      key={font.tailwindClass}
                      className={`block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 cursor-pointer ${font.tailwindClass}`}
                      onClick={() => selectFont(font)}>
                      {font.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="h-5 border-l border-[#eeeeee]"></div>
            {/* Toggle de modo oscuro */}
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)} />
              <div className="w-12 h-6 bg-gray-400 peer-checked:bg-gray-700 rounded-full relative transition">
                <div
                  className={`w-5 h-5 bg-white absolute top-0.5 rounded-full transition-all duration-300 ease-in-out ${darkMode ? "left-6" : "left-1"
                    }`}></div>
              </div>
            </label>
            {/* Icono de luna */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
        </div>
      </header>
      <div className="min-h-screen flex flex-col items-center p-6">
        <h1 className={`text-3xl text-center font-semibold text-[#262626] ${darkMode ? "text-[#ffff]" : ""} ${currentFont.tailwindClass}`}>
          Product Manager
        </h1>
        <div className={`w-full max-w-md p-6 ${currentFont.tailwindClass}`}>
          <input
            type="text"
            placeholder="Name of Product"
            value={productName}
            onChange={(e) => {
              const onlyText = e.target.value.replace(/[^a-zA-ZÀ-ÿñÑ\s]/g, ""); // Permite letras, espacios, tildes y "ñ"
              setProductName(onlyText);
            }}
            className={`w-full p-3 border-2 rounded-2xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm ${errors.name ? "border-red-500 focus:ring-red-500" : "mb-2"} ${darkMode ? "text-white bg-[#1e1e1e]" : "bg-white "} ${currentFont.tailwindClass}`}
          />
          {errors.name && <p className="text-red-500 text-sm text-center">{errors.name}</p>}
          <textarea
            key={darkMode ? "dark" : "light"}
            placeholder="Description of Product"
            value={productDesc}
            onChange={(e) => {
              const onlyText = e.target.value.replace(/[^a-zA-ZÀ-ÿñÑ\s]/g, ""); // Permite letras, espacios, tildes y "ñ"
              setProductDesc(onlyText);
            }}
            className={`w-full p-3 border-2 rounded-2xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm ${errors.name ? "border-red-500 focus:ring-red-500" : "mb-2"} ${darkMode ? "text-white  bg-[#1e1e1e]" : "bg-white "} ${currentFont.tailwindClass}`}
          />
          {errors.desc && <p className="text-red-500 text-sm text-center">{errors.desc}</p>}
          <input
            type="number"
            placeholder="Quantity of Product"
            value={productQuantity}
            onChange={(e) => {
              const value = e.target.value;
              setProductQuantity(value === "" ? "" : Number(value));
            }}
            className={`w-full p-3 border-2 rounded-2xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm ${errors.quantity ? "border-red-500 focus:ring-red-500" : "mb-2"} ${darkMode ? " text-white bg-[#1e1e1e]" : "bg-white "} ${currentFont.tailwindClass}`}
            min="1"
          />
          {errors.quantity && <p className="text-red-500 text-sm text-center">{errors.quantity}</p>}
          <button
            onClick={addProduct}
            className={`w-full p-3 text-white font-semibold rounded-2xl transition-all duration-300 ease-in-out transform bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400  flex items-center justify-center gap-2 cursor-pointer ${currentFont.tailwindClass}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 30 30"
              style={{ fill: "#FFFFFF" }}
            >
              <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M21,16h-5v5 c0,0.553-0.448,1-1,1s-1-0.447-1-1v-5H9c-0.552,0-1-0.447-1-1s0.448-1,1-1h5V9c0-0.553,0.448-1,1-1s1,0.447,1,1v5h5 c0.552,0,1,0.447,1,1S21.552,16,21,16z"></path>
            </svg>
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          products.length > 0 && (
            <AnimatePresence>
              {/* Título */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className={`text-xl text-center font-semibold text-[#262626] ${darkMode ? "text-[#ffff]" : ""} ${currentFont.tailwindClass}`}
              >
                List of Products
              </motion.h2>
              <motion.div
                key={'sort'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className={`p-4 mb-3 relative  ${currentFont.tailwindClass}`}
              >
                <div className="flex gap-4 items-start w-full max-w-xs mx-auto mt-4">
                  {/* Dropdown personalizado */}
                  <div className="relative w-full">
                    <button
                      onClick={() => setIsOpenSort(!isOpenSort)}
                      className={`w-full p-3 cursor-pointer border-2 border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-purple-500 flex justify-between items-center transition-all ${darkMode ? "bg-[#121212] text-white border-gray-600" : "bg-white text-gray-900"
                        }`}
                    >

                      {sortBy === "code" ? "📌 Code" :
                        sortBy === "name" ? "🔤 Name" :
                          sortBy === "quantity" ? "📦 Quantity" : "📅 Created"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-purple-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {isOpenSort && (
                      <ul
                        className={`absolute w-full border-2 rounded-xl shadow-md mt-2 overflow-hidden z-10 ${darkMode ? "bg-[#121212] border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                          }`}
                      >
                        {["code", "name", "quantity", "creation"].map((item, index) => (
                          <li
                            key={`sort-${item}-${index}`} // Asegúrate de que cada clave sea única
                            onClick={() => {
                              setSortBy(item as "code" | "name" | "quantity" | "creation");
                              setIsOpenSort(false);
                            }}
                            className={`p-3 cursor-pointer transition-all ${darkMode ? "hover:bg-gray-800" : "hover:bg-purple-100"
                              }`}
                          >
                            {item === "code" ? "📌 Code" :
                              item === "name" ? "🔤 Name" :
                                item === "quantity" ? "📦 Quantity" : "📅 Created"}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Botón de orden */}
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition-all focus:ring-2 focus:ring-purple-500 w-full"
                  >
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                    {sortOrder === "asc" ? "🔼" : "🔽"}
                  </button>
                </div>
              </motion.div>
              {/* Lista de Productos */}
              {sortedProducts.map((product) => (
                <motion.div
                  key={product.codigo}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className={`p-4 rounded-lg shadow-md mb-3 relative w-[15rem] ${darkMode ? "bg-[#121212] text-white border border-white" : "bg-white text-[#262626] border border-gray-300"
                    }`}
                >
                  <button
                    onClick={() => removeProduct(product.codigo)}
                    className="absolute top-2 right-2 text-purple-500 hover:text-purple-700 cursor-pointer"
                  >
                    ✕
                  </button>
                  <div className={`text-center ${currentFont.tailwindClass}`}>
                    <h3 className="font-bold break-words overflow-hidden">{product.nombre}</h3>
                    <ul className="list-disc list-inside text-sm text-gray-500 text-left mt-2">
                      <li className="break-words overflow-hidden">
                        <strong>Description:</strong> {product.descripcion}
                      </li>
                      <li>
                        <strong>Quantity:</strong> {product.cantidad}
                      </li>
                      <li>
                        <strong>Created:</strong> {new Date(product.creacion).toLocaleDateString()}
                      </li>
                      <li>
                        <strong>Code:</strong> {product.codigo}
                      </li>
                    </ul>
                  </div>
                </motion.div>
              ))}


            </AnimatePresence>
          )
        )}
        {/* Modal de error */}
        {errorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-semibold mb-4">You cannot add an existing product.</h2>
              <button
                onClick={() => setErrorModal(false)}
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}





