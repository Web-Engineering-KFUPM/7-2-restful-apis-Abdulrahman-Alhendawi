import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db.js";
import { Song } from "./models/song.model.js";

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());              
app.use(express.json());

await connectDB(process.env.MONGO_URL);


// GET /api/songs (Read all songs)
app.get("/api/songs", async (req, res) => {
	try {
		const songs = await Song.find();
		res.json(songs);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// POST /api/songs (Insert song)
app.post("/api/songs", async (req, res) => {
	try {
		const { title, artist, year } = req.body;
		const song = new Song({ title, artist, year });
		await song.save();
		res.status(201).json(song);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// PUT /api/songs/:id (Update song)
app.put("/api/songs/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { title, artist, year } = req.body;
		const song = await Song.findByIdAndUpdate(
			id,
			{ title, artist, year },
			{ new: true, runValidators: true }
		);
		if (!song) return res.status(404).json({ message: "Song not found" });
		res.json(song);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// DELETE /api/songs/:id (Delete song)
app.delete("/api/songs/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const song = await Song.findByIdAndDelete(id);
		if (!song) return res.status(404).json({ message: "Song not found" });
		res.json({ message: "Song deleted" });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
