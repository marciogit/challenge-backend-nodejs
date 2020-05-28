const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// RETURN A LIST OF REPOSITORIES
app.get("/repositories", (request, response) => {
	return response.json(repositories);
});

// CREATES A NEW REPOSITORY
app.post("/repositories", (request, response) => {
	const { id, title, url, techs, likes } = request.body;

	const repository = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0
	}

	repositories.push(repository);

	return response.status(200).json(repository);
});

// UPDATES A REPOSITORY
app.put("/repositories/:id", (request, response) => {
	const { id } = request.params;
	const { title, url, techs } = request.body;

	const findRepoIndex = repositories.findIndex(repo => repo.id === id);

	if(findRepoIndex === -1) {
		return response.status(400).json({ error: "It seems like the repository doesn't exists." });
	}

	const repository = {
		id,
		title,
		url,
		techs,
		likes: repositories[findRepoIndex].likes,
	}

	repositories[findRepoIndex] = repository;

	return response.json(repository);
});

// DELETE A SPECIFIC REPOSITORY BY ID
app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params;

	const findRepoIndex = repositories.findIndex(repo => repo.id === id);

	if(findRepoIndex >= 0) {
		repositories.splice(findRepoIndex, 1);
	} else {
		return response.status(400).json({ error: "It seems like the repository doesn't exists." });
	}

	return response.status(204).send();
});

// GIVES A LIKE TO A SPECIFIC REPOSITORY BY ID
app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params;

	const findRepoIndex = repositories.findIndex(repo => repo.id === id);

	if(findRepoIndex === -1) {
		return response.status(400).json({ error: "Repository doesn't exists." });
	}

	repositories[findRepoIndex].likes++;

	return response.json(repositories[findRepoIndex]);
});

module.exports = app;
