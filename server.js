const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db.json")

var app = express();
var PORT = process.env.PORT || 3000;


app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/index"));
});

// Notes html and it's "url"
app.get("/notes", function (req, res) {
    const databaseRead = fs.readFileSync(path.join(__dirname,'db/db.json'))
    const databaseNotes = JSON.parse(databaseRead)
    res.json(databaseNotes);
})



// Since the GET and POST functions grab from the same route, we can set it once up here.
app.post("/notes", function (req, res) {
    console.log("im here")
const databaseRead = fs.readFileSync(path.join(__dirname,'db/db.json'))
        let newNote = req.body;
const databaseNotes = JSON.parse(databaseRead)
        // This allows the test note to be the original note.
        let highestId = 99;
        // This loops through the array and finds the highest ID.
        for (let i = 0; i < databaseNotes.length; i++) {
            let individualNote = databaseNotes[i];

            if (individualNote.id > highestId) {
                // highestId will always be the highest numbered id in the notesArray.
                highestId = individualNote.id;
            }
        }
        // This assigns an ID to the newNote. 
        newNote.id = highestId + 1;
        // We push it to db.json.
        databaseNotes.push(newNote)

        // Write the db.json file again.
        fs.writeFile(path.join(__dirname,'db/db.json'), JSON.stringify(databaseNotes), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        // Gives back the response, which is the user's new note. 
        res.json(newNote);
    });


app.delete("/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    // request to delete note by id.
    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            // Splice takes i position, and then deletes the 1 note.
            database.splice(i, 1);
            break;
        }
    }
    // Write the db.json file again.
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(database);
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});