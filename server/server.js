const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
	origin: ["https://task-forge-mern.vercel.app"], // frontend URL
};

app.use(cors(corsOptions));
app.use(express.json()); // ✅ For parsing JSON payloads

let todos = [];


app.get("/todos", (req, res) => {
	res.json(todos);
});


app.post("/todos", (req, res) => {
	const newTodo = { id: Date.now(), ...req.body };
	todos.push(newTodo);
	res.status(201).json(newTodo);
});


app.put("/todos/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const index = todos.findIndex((todo) => todo.id === id);

	if (index === -1) return res.status(404).json({ message: "Todo not found" });

	todos[index] = { ...todos[index], ...req.body };
	res.json(todos[index]);
});


app.delete("/todos/:id", (req, res) => {
	const id = parseInt(req.params.id);
	todos = todos.filter((todo) => todo.id !== id);
	res.json({ message: "Todo deleted" });
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
