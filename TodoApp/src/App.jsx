import { FaTag } from "react-icons/fa6";
import { FaSquarePlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { MdAssignment } from "react-icons/md";
import { AiFillThunderbolt } from "react-icons/ai";
import React, { useState, useRef, useEffect } from "react";

function App() {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState("");
	const [total,setTotal] = useState(0);
	const [active, setActive] = useState(0);
	const [done, setDone] = useState(0);
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
	function deleteTodo(id){
		setTodos(todos.filter(todo=>todo.id!==id))
	}

	function Edit(id){
		const todoToEdit = todos.find(todo => todo.id === id);
		if (todoToEdit) {
			setInput(todoToEdit.text);
			setTodos(todos.filter(todo => todo.id !== id));
		}
	}

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
						<button className="flex gap-2 items-center">
							<MdAssignment className="text-amber-800" />
							All
						</button>
						<button className="flex gap-2 items-center">
							<AiFillThunderbolt className="text-amber-300" />
							Active
						</button>
						<button>✅ Done</button>
					</div>
				</div>
				<div className="flex gap-2 mt-3">
					📝 {total} total 🔵 {active} active ✅ {done} done
				</div>
				<hr className="border-4 rounded-3xl border-gray-200 m-2" />
				{todos.length === 0 && (
					<div className="w-full flex items-center justify-center h-[150px] flex-col gap-2">
						<p className="text-[40px]">🎯</p>
						<p className="text-[15px] text-gray-400">No todos found matching your criteriaNo todos found matching your criteria</p>
					</div>
				)}
				{todos.map((todo) => (
					<div
						key={todo.id}
						className="group flex gap-2 items-center mt-2 justify-between text-center h-[50px]"
					>
						<div className="flex items-center gap-2">
							<input type="radio" onClick={() => setDone(done + 1)} />
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
