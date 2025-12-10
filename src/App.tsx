import { useEffect, useState } from "react";

type Priority = "Urgent" | "Moyenne" | "Basse";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const [filter, setFilter] = useState<Priority | "Tous">("Tous");

  // Initialisation des todos depuis le localStorage (une seule fois au montage)
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("Todos");
    if (!savedTodos) return [];

    try {
      return JSON.parse(savedTodos) as Todo[];
    } catch (error) {
      console.error(
        "Valeur invalide dans localStorage['Todos'], on repart à zéro :",
        error
      );
      return [];
    }
  });

  // À chaque changement de `todos`, on sauvegarde dans le localStorage
  useEffect(() => {
    localStorage.setItem("Todos", JSON.stringify(todos));
  }, [todos]);

  // Ajout d’une todo
  function addTodo() {
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
    };

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    setInput("");
    setPriority("Moyenne");
    console.log("Todos après ajout :", newTodos);
  }

  function deleteTodo(id: number) {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }

  // Application du filtre
  let filteredTodos: Todo[] = [];
  if (filter === "Tous") {
    filteredTodos = todos;
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter);
  }

  function getPriorityBadgeClass(priority: Priority) {
    if (priority === "Urgent") return "badge badge-error";
    if (priority === "Moyenne") return "badge badge-warning";
    return "badge badge-success";
  }

  return (
    <div className="flex justify-center min-h-screen items-start pt-10">
      <div className="w-2/3 flex flex-col gap-4 bg-base-300 p-5 rounded-2xl">
        {/* Filtres */}
        <div className="space-y-2">
          <p className="font-semibold">Filtrer par priorité :</p>
          <div className="flex flex-wrap gap-2">
            <button
              className={`btn btn-soft ${
                filter === "Tous" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Tous")}
            >
              Tous
            </button>
            <button
              className={`btn btn-soft ${
                filter === "Urgent" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Urgent")}
            >
              Urgent
            </button>
            <button
              className={`btn btn-soft ${
                filter === "Moyenne" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Moyenne")}
            >
              Moyenne
            </button>
            <button
              className={`btn btn-soft ${
                filter === "Basse" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Basse")}
            >
              Basse
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        <div className="flex gap-4">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className="select w-full max-w-xs"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgent">Urgent</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button onClick={addTodo} className="btn btn-primary">
            Ajouter
          </button>
        </div>

        {/* Liste des tâches */}
        <div className="mt-4">
          {filteredTodos.length === 0 ? (
            <p className="text-sm opacity-70">
              Aucune tâche à afficher pour ce filtre.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between bg-base-100 p-3 rounded-xl"
                >
                  <div className="flex flex-col gap-1">
                    <span>{todo.text}</span>
                    <span className={getPriorityBadgeClass(todo.priority)}>
                      {todo.priority}
                    </span>
                  </div>

                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
