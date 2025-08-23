import { FaTag } from "react-icons/fa6";
import { FaSquarePlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { MdAssignment } from "react-icons/md";
import { AiFillThunderbolt } from "react-icons/ai";
import { SlCalender } from "react-icons/sl";
import React, { useState, useRef, useEffect } from "react";
import {
	formatDistanceToNow,
	differenceInMinutes,
	differenceInHours,
	differenceInDays,
} from "date-fns";

function App() {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState("");
	const [total, setTotal] = useState(0);
	const [active, setActive] = useState(0);
	const [done, setDone] = useState(0);
	const [completed, setCompleted] = useState(0);
	const [filter, setFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [optionsVisible, setOptionsVisible] = useState(false);
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState("Medium Priority");
	const options = ["Low Priority", "Medium Priority", "High Priority"];
	const [category,setCategory] = useState("")
	const inputRef = useRef();

	const inputUpdate = (value) => {
		if (inputRef.current) {
			inputRef.current.value = value; // Update input value
			setCategory(value)
		}
	};

	const filteredTodos = todos
		.filter((todo) => {
			if (filter === "all") return true;
			if (filter === "active") return !todo.completed;
			if (filter === "done") return todo.completed;
			return true;
		})
		.filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()));

	const toggleOptions = () => {
		setOptionsVisible(!optionsVisible);
	};

	const searchTodos = todos.filter((todo) =>
		todo.text.toLowerCase().includes(search.toLowerCase())
	);

	function getCustomTimeAgo(date) {
		const now = new Date();
		const minutes = differenceInMinutes(now, date);
		const hours = differenceInHours(now, date);
		const days = differenceInDays(now, date);

		if (minutes < 1) return "0h ago";
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	}

	function clearCompleted() {
		setTodos(todos.filter((todo) => !todo.completed));
	}

	function addTodo() {
		if (input.trim() === "") return;

		if (editingId !== null) {
			// Update existing todo
			setTodos((prevTodos) =>
				prevTodos.map((todo) =>
					todo.id === editingId
						? { ...todo, text: input, editedAt: new Date(), edit: true }
						: todo
				)
			);
			setEditingId(null);
			setInput("");
			return;
		}
		const newTodo = {
			id: todos.length + 1,
			text: input,
			completed: false,
			createdAt: new Date(),
			editedAt: null,
			edit: false,
			priority:selected,
			category:category
		};
		setTodos([...todos, newTodo]);
		setTotal(todos.length + 1);
		setActive(todos.length + 1);
		setDone(done + 0);
		setInput("");
	}

	function setDoneCount(id) {
		setTodos((prevTodos) => {
			const updatedTodos = prevTodos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			);

			const completedCount = updatedTodos.filter(
				(todo) => todo.completed
			).length;
			setCompleted(
				updatedTodos.length > 0
					? Math.round((completedCount / updatedTodos.length) * 100)
					: 0
			);
			setDone(completedCount);

			return updatedTodos;
		});
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
			setEditingId(id);
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
			<div className=" shadow-lg inset-shadow-black boxs w-[700px] p-4 py-6 min-h-[150px] rounded-lg mt-[60px]">
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

				<div className="w-full" id="options">
					<div className="flex items-center w-full justify-between">
						<button
							className="text-gray-500 cursor-pointer flex gap-2 items-center text-[12px] hover:bg-gray-100 mt-4 px-4 py-1 rounded-lg"
							onClick={toggleOptions}
						>
							<FaTag />
							{optionsVisible ? "Hide Options" : "Select Options"}
						</button>
						<div className="flex gap-2">
							{selected != "Medium Priority" && (
								<p
									className={`text-center text-[13px] ${
										selected == "Low Priority"
											? " bg-green-300 text-green-800"
											: " bg-red-400 text-red-800"
									} rounded-lg px-2`}
								>
									{selected == "Medium Priority" ? null : selected}
								</p>
							)}
							<p className="text-[13px] shadow-lg">{category}</p>
						</div>
					</div>

					{optionsVisible && (
						<div className="w-full h-[150px] p-3 flex gap-5">
							<div className="flex flex-col w-[50%]">
								<label className="text-[15px] mb-2">Priority</label>

								<div className="relative w-[300px] ml-2">
									<button
										onClick={() => setOpen((prev) => !prev)}
										className="text-[13px] bg-gray-100 w-full p-2 rounded-lg text-gray-700 duration-150 transition-all flex justify-between items-center border border-gray-300"
									>
										{selected}
										<span className="ml-2">{open ? "▲" : "▼"}</span>
									</button>

									{open && (
										<ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 animate-fadeIn">
											{options.map((option) => (
												<li
													key={option}
													onClick={() => {
														setSelected(option);
														setOpen(false);
													}}
													className={`cursor-pointer px-3 py-2 text-[13px] hover:bg-blue-100 ${
														selected === option
															? "bg-blue-50 text-blue-600"
															: ""
													}`}
												>
													{option}
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
							<div className="w-full flex flex-col">
								<label className="text-[15px] mb-2">Category</label>
								<input
									type="text"
									className="bg-gray-100 rounded-lg p-2 text-[15px]"
									placeholder="Enter category"
									ref={inputRef}
									onChange={(e) => e.target.value}
								/>
								<div>
									<ul className="flex gap-4 text-[13px] mt-2 flex-wrap cursor-pointer">
										<li
											className="hover:bg-gray-200 rounded-lg px-3 py-1"
											onClick={() => inputUpdate("Work")}
										>
											Work
										</li>
										<li
											className="hover:bg-gray-200 rounded-lg px-3 py-1"
											onClick={() => inputUpdate("Personal")}
										>
											Personal
										</li>
										<li
											className="hover:bg-gray-200 rounded-lg px-3 py-1"
											onClick={() => inputUpdate("Shopping")}
										>
											Shopping
										</li>
										<li
											className="hover:bg-gray-200 rounded-lg px-3 py-1"
											onClick={() => inputUpdate("Health")}
										>
											Health
										</li>
										<li
											className="hover:bg-gray-200 rounded-lg px-3 py-1"
											onClick={() => inputUpdate("Learning")}
										>
											Learning
										</li>
									</ul>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className=" shadow-lg inset-shadow-black boxs w-[700px] p-4 py-2 min-h-[150px] rounded-lg mt-[60px]">
				<div className="flex justify-between items-center">
					<div className="flex items-center relative">
						<CiSearch className="absolute left-1" />
						<input
							type="text"
							placeholder="Search todos and categories..."
							className="text-sm pl-6 bg-gray-100 w-[400px] rounded-lg p-2"
							onChange={(e) => setSearch(e.target.value)}
							value={search}
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
					<div className="flex items-center">
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
							{todo.priority !== "Medium Priority" && (
								<span
									className={`text-[11px] px-2 py-0.5 rounded ${
										todo.priority === "Low Priority"
											? "bg-green-200 text-green-800"
											: "bg-red-200 text-red-800"
									}`}
								>
									{todo.priority}
								</span>
							)}
							{/* ✅ Show Category if exists */}
							{todo.category && (
								<span className="text-[11px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
									{todo.category}
								</span>
							)}
						</div>
						<div className="flex gap-3">
							<p className="text-[10px] text-gray-400 flex items-center gap-1">
								<SlCalender />
								{getCustomTimeAgo(new Date(todo.createdAt))}
							</p>
							{todo.editedAt && (
								<p className="text-[10px] text-gray-400 flex items-center gap-1">
									<SlCalender />
									edited {getCustomTimeAgo(new Date(todo.editedAt))}
								</p>
							)}
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
