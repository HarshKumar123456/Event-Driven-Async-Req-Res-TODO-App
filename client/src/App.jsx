import React, { useState } from "react";
import { useWebSocketContext } from "./context/WebSocketContext";
import { useSocketListener } from "./hooks/useSocketListener";

function App() {
  const { isConnected, clientId } = useWebSocketContext();

  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState("pending");
  const [operation, setOperation] = useState("");

  const API_BASE = "http://localhost:8000/api/v1/todo";
  const USER_ID = "007";

  console.log("Websocket Connect hai kya ", isConnected === true ? "are haan bhai haan!" : "are na bhai na", " Client Id: ", clientId);


  // Websocket Event Listening Logic - Starts Here
  // Listener 1: Handle Todo Reads
  useSocketListener(
    // Selector: "Is this message for me?"
    (msg) => msg.type?.includes('todo.read.responses'),

    // Handler: "What do I do with it?"
    (msg) => {
      setOperation("Got Todos Successfully...."); // Clear loading state
      const incoming = Array.isArray(msg.data) ? msg.data : [msg.data];
      // You can merge or replace depending on your logic
      setTodos(incoming);
      console.log("Updated via WS");
    }
  );


  // Listener 2: Handle Todo Updates
  useSocketListener(
    // Selector: "Is this message for me?"
    (msg) => msg.type?.includes("todo.create.responses") || msg.type?.includes("todo.update.responses") || msg.type?.includes("todo.delete.responses"),

    // Handler: "What do I do with it?"
    async (msg) => {
      await fetchTodos();
    }
  );

  // Websocket Event Listening Logic - Ends Here



  const fetchTodos = async () => {
    setOperation("Fetching TODOs....");
    if (!clientId) {
      console.warn("No clientId yet; connect websocket first.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "GET",
        headers: { "client-id": clientId },
      });
      console.log("Fetch todos response status:", res.status);
      setOperation("");
    } catch (err) {
      console.error(err);
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();
    if (!clientId) return console.warn("No clientId yet.");
    setOperation("Creating TODO....");
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "client-id": clientId },
        body: JSON.stringify({ userId: USER_ID, name, priority, status }),
      });
      setName("");
      console.log("Create request status:", res.status);

      await fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    if (!clientId) return console.warn("No clientId yet.");
    setOperation("Deleting TODO....");

    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "client-id": clientId },
        body: JSON.stringify({ userId: USER_ID, id }),
      });
      console.log("Delete request status:", res.status);

      await fetchTodos();

    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (todo) => {
    if (!clientId) return console.warn("No clientId yet.");
    setOperation("Updating TODO....");
    const newStatus = todo.todoStatus === "completed" || todo.status === "completed" ? "pending" : "completed";
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "client-id": clientId },
        body: JSON.stringify({ userId: USER_ID, id: todo.id, status: newStatus }),
      });
      console.log("Update request status:", res.status);

      await fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div className="p-6">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">Event Driven TODO App</h1>

      <h2 className="text-xl">
        {operation || "Here are you TODOs"}
      </h2>

      <div className="mb-4 text-xl">
        <strong>WebSocket:</strong> {clientId ? (<span className="text-green-600">connected ({clientId})</span>) : (<span className="text-yellow-600">connecting…</span>)}
        <button className="cursor-pointer hover:bg-blue-300 active:bg-blue-700 ml-4 px-3 py-1 bg-blue-500 text-white rounded" onClick={fetchTodos}>Fetch Todos</button>
      </div>

      <form onSubmit={createTodo} className="mb-6">
        <div className="flex gap-2 items-center text-xl font-bold">
          <input placeholder="Todo name" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-md p-2 m-2 flex-1" />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border rounded-md p-2">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-md p-2">
            <option value="pending">pending</option>
            <option value="completed">completed</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">Add</button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Todos</h2>
        {todos && todos.length ? (
          <ul className="space-y-2">
            {todos.map((t) => (
              <li key={t.id} className={`flex items-center justify-between text-xl font-bold border border-8 px-8 py-4 rounded-3xl ${t.status === "pending" ? "border-red-400" : "border-lime-400"} ${t.priority === "low" ? "bg-sky-200" : t.priority === "medium" ? "bg-purple-400" : "bg-rose-600"}`}>
                <div>
                  <div className="font-medium">{t.todoName || t.name}</div>
                  {t.status}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(t)} className="cursor-pointer hover:bg-yellow-700 active:bg-yellow-900 px-2 py-1 bg-yellow-500 text-white rounded">Toggle</button>
                  <button onClick={() => deleteTodo(t.id)} className="cursor-pointer hover:bg-red-700 active:bg-red-900 px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No todos yet. Click "Fetch Todos" to request todos from server.</div>
        )}
      </div>
    </div>
  );
}

export default App;
