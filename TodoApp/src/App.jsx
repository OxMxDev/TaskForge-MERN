import { FaTag } from "react-icons/fa6";
import { FaSquarePlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { MdAssignment } from "react-icons/md";
import { AiFillThunderbolt } from "react-icons/ai";
import React, { useState, useRef, useEffect } from "react";

function App() {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState("");
	const [total, setTotal] = useState(0);
	const [active, setActive] = useState(0);
	const [done, setDone] = useState(0);
	const [completed, setCompleted] = useState(0);
	const [filter, setFilter] = useState("all"); // "all", "active", or "done"

	const filteredTodos = todos.filter((todo) => {
		if (filter === "all") return true;
		if (filter === "active") return !todo.completed;
		if (filter === "done") return todo.completed;
		return true;
	});

	function clearCompleted() {
		setTodos((todos) => todos.filter((todo) => !todo.completed));
	}

	function addTodo() {
		if (input.trim() === "") return;
		const newTodo = {
			id: todos.length + 1,
			text: input,
			completed: false,
		};
		setTodos([...todos, newTodo]);
		setTotal(todos.length + 1);
		setActive(todos.length + 1);
		setDone(done + 0);
		setInput("");
	}

	function setDoneCount(id) {
		setTodos((prevTodos) =>
			prevTodos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		);
		const completedCount = todos.filter((todo) => todo.completed).length + 1;
		console.log(completedCount);
		setCompleted(Math.round((completedCount / todos.length) * 100));
		setDone(completedCount);
	}

	function deleteTodo(id) {
		setTodos(todos.filter((todo) => todo.id !== id));
		setDone(done - 1);
		setTotal(total - 1);
		setActive(active - 1);
	}

	function Edit(id) {
		const todoToEdit = todos.find((todo) => todo.id === id);
		if (todoToEdit) {
			setInput(todoToEdit.text);
			setTodos(todos.filter((todo) => todo.id !== id));
		}
	}

	const getProgressColor = () => {
		if (completed < 30) return "bg-red-500";
		if (completed < 70) return "bg-yellow-500";
		return "bg-green-500";
	};

	useEffect(() => {
		setTotal(todos.length);
		setDone(todos.filter((todo) => todo.completed).length);
		setActive(todos.filter((todo) => !todo.completed).length);
		const completedCount = todos.filter((todo) => todo.completed).length;
		setCompleted(
			todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0
		);
	}, [todos]);

	return (
		<div className="w-full h-full flex items-center flex-col">
			<h1 className="text-[30px]">Todo App</h1>
			<h5 className="text-gray-600">Stay organized and get things done</h5>
			<div className=" shadow-lg inset-shadow-black boxs w-[700px] p-4 py-6 h-[150px] rounded-lg mt-[60px]">
				<div className="flex gap-2">
					<input
						type="text"
						value={input}
						className="text-sm bg-gray-100 w-[600px] rounded-lg p-2"
						onChange={(e) => setInput(e.target.value)}
						placeholder="What needs to be done?"
					/>
					<button
						className="text-white flex items-center gap-2 font-bold text-sm bg-gray-400 px-6 py-2 rounded-lg cursor-pointer"
						onClick={addTodo}
					>
						<FaSquarePlus />
						Add
					</button>
				</div>

				<button className="text-gray-500 cursor-pointer flex gap-2 items-center text-[12px] hover:bg-gray-100 mt-4 px-4 py-1 rounded-lg">
					<FaTag />
					Show Options
				</button>
			</div>
			<div className=" shadow-lg inset-shadow-black boxs w-[700px] p-4 py-2 min-h-[150px] rounded-lg mt-[60px]">
				<div className="flex justify-between items-center">
					<div className="flex items-center relative">
						<CiSearch className="absolute left-1" />
						<input
							type="text"
							placeholder="Search todos and categories..."
							className="text-sm pl-6 bg-gray-100 w-[400px] rounded-lg p-2"
						/>
					</div>
					<div className="flex bg-gray-100 gap-2 w-[250px] rounded-lg p-1.5 justify-between">
						<button
							className="flex gap-2 px-2 items-center cursor-pointer hover:bg-white rounded-lg"
							onClick={() => setFilter("all")}
						>
							<MdAssignment className="text-amber-800" />
							All
						</button>
						<button
							className="flex gap-2 items-center px-2 rounded-lg cursor-pointer hover:bg-white"
							onClick={() => setFilter("active")}
						>
							<AiFillThunderbolt className="text-amber-300" />
							Active
						</button>
						<button
							onClick={() => setFilter("done")}
							className="cursor-pointer hover:bg-white px-2 rounded-lg"
						>
							✅ Done
						</button>
					</div>
				</div>
				<div className="flex gap-2 mt-3 justify-between items-center">
					<div className="flex">
						<p>📝 {total} total</p>
						<p>🔵 {active} active</p>
						<p>✅ {done} done</p>
						<p className="shadow-lg shadow-black/10 rounded-lg text-center font-bold text-[13px] outline-0 ml-2">
							{completed}% completed
						</p>
					</div>
					{completed > 1 && (
						<button
							className="ml-8 border-red-100 text-red-500 py-1 font-bold text-[13px] px-2 border-2 rounded-lg shadow-lg cursor-pointer"
							onClick={() => clearCompleted()}
						>
							🗑️ Clear completed ({done})
						</button>
					)}
				</div>
				<div className="w-full bg-gray-200 rounded-3xl h-3 mt-3">
					<div
						className={`${getProgressColor()} h-3 rounded-3xl transition-all duration-500`}
						style={{ width: `${completed}%` }}
					></div>
				</div>

				{todos.length === 0 && (
					<div className="w-full flex items-center justify-center h-[150px] flex-col gap-2">
						<p className="text-[40px]">🎯</p>
						<p className="text-[15px] text-gray-400">
							No todos found matching your criteriaNo todos found matching your
							criteria
						</p>
					</div>
				)}
				{filteredTodos.map((todo) => (
					<div
						key={todo.id}
						className="group flex gap-2 items-center mt-2 justify-between text-center h-[50px]"
					>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								onChange={() => setDoneCount(todo.id)}
								checked={todo.completed}
							/>
							<li className="list-none">{todo.text}</li>
						</div>
						<div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
							<button
								onClick={() => {
									Edit(todo.id);
								}}
								className=" text-blue-700 cursor-pointer hover:bg-amber-100 rounded-lg p-2"
							>
								✏️
							</button>
							<button
								onClick={() => {
									deleteTodo(todo.id);
								}}
								className=" text-red-700 cursor-pointer hover:bg-red-100 rounded-lg p-2"
							>
								🗑️
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
