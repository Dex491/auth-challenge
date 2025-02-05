import { useEffect, useState } from "react";
import "./App.css";
import MovieForm from "./components/MovieForm";
import UserForm from "./components/UserForm";

const apiUrl = "http://localhost:4000";

function App() {
	const [movies, setMovies] = useState([]);
	const [registerResponse, setRegisterResponse] = useState(null);
	const [loginResponse, setLoginResponse] = useState(null);
	const [movieResponse, setMovieResponse] = useState(null);

	useEffect(() => {
		fetchMovies();
	}, []);

	const fetchMovies = async () => {
		const res = await fetch(`${apiUrl}/movie`);
		const data = await res.json();
		setMovies(data.movies);
	};

	const handleRegister = async (user) => {
		if (!user.username || !user.password) return;

		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		};

		const res = await fetch(`${apiUrl}/user/register`, options);
		const data = await res.json();
		setRegisterResponse(data);
	};

	const handleLogin = async (user) => {
		if (!user.username || !user.password) return;

		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		};

		const res = await fetch(`${apiUrl}/user/login`, options);
		const accessToken = await res.json();

		localStorage.setItem("access-token", accessToken.data);
		setLoginResponse(accessToken);
	};

	const handleCreateMovie = async (movie) => {
		const accessToken = localStorage.getItem("access-token");

		if (!accessToken) {
			console.log("Please log in first!");
			setMovieResponse("Please log in first!");
			return;
		}

		if ((!movie.title, !movie.description, !movie.runtimeMins)) return;

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(movie),
		};

		try {
			const res = await fetch(`${apiUrl}/movie`, options);
			const data = await res.json();
			setMovies([...movies, data.data]);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="App">
			<h1>Register</h1>
			<UserForm handleSubmit={handleRegister} />

			<h1>Login</h1>
			<UserForm handleSubmit={handleLogin} />

			<h1>Create a movie</h1>
			<MovieForm handleSubmit={handleCreateMovie} />

			<h1>Movie list</h1>
			<ul>
				{movies.map((movie) => {
					return (
						<li key={movie.id}>
							<h3>{movie.title}</h3>
							<p>Description: {movie.description}</p>
							<p>Runtime: {movie.runtimeMins}</p>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default App;
