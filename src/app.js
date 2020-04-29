const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

app.use((request, response, next) => {
	const { method, url } = request;

	const logLabel = `[${method.toUpperCase()}] ${url}`;

	console.time(logLabel);

	next();

	console.timeEnd(logLabel);
});

app.use('/repositories/:id', (request, response, next) => {
	const { id } = request.params;

	if(!isUuid(id)){
		return response.status(400).json({success: false, error: "Invalid UUID"});
	}

	if(!(!!repositories.find(index => index.id === id))) {
		return response.status(400).json({ succes: false, message:`Element with ID ${id} don't exist` });
	}

	return next();
});



let repositories = [];

app.get("/repositories", (request, response) => {
	return response.json(repositories)
});

app.post("/repositories", (request, response) => {
	const { title, owner, techs } = request.body;

	const project = {
		id: uuid(),
		title: title,
		techs: techs,
		owner: owner,
		likes: 0,
		url: `https://github.com/Rocketseat/${title.toLowerCase()}`
	}

	repositories.push(project);

	return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
	const { id } = request.params;
	const { title, techs } = request.body;

	try {
		for(let x = 0; x < repositories.length; x++) {
			if(repositories[x].id === id ){
				let url = `https://github.com/Rocketseat/${title ? title.toLowerCase() : repositories[x].title.toLowerCase()}` 
				repositories[x] = {
					...repositories[x],
					title: title,
					techs: techs,
					url: url
				}

				return response.json(repositories[x]);
			}
		}
	} catch(err) {
		return response.status(400).json({ succes: false, message:`Has some error in update: ${err}` });
	}
});

app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params;
	
	repositories = repositories.filter(repository => repository.id !== id);

	//return response.json({ succes: true, message:`Element with ID ${id} deleted with success` });
	return response.status(204);
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params;

	
	try {
		for(let x = 0; x < repositories.length; x++) {
			if(repositories[x].id === id ){
				let likesQuantity = repositories[x].likes + 1;

				repositories[x].likes = likesQuantity;

				//return response.json({ succes: true, message:`Element with ID ${id} has updated with success`, data: repositories[x] });
				return response.json({likes: likesQuantity});
			}
		}
	} catch(err) {
		return response.status(400).json({ succes: false, message:`Has some error in update: ${err}` });
	}
});

module.exports = app;
