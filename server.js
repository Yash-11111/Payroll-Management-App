const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs").promises;
const fileHandler = require('./modules/fileHandler');


const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, "employees.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");

// Helper functions
async function readEmployees() {
    try {
        const data = await fs.readFile(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

async function writeEmployees(data) {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}

// Routes
app.get('/', async (req, res) => {
    const employees = await readEmployees();
    res.render('index', { employees });
});

app.get('/add', (req, res) => {
    res.render('add');
});

// add data

app.post('/add', async (req, res) => {
    const { name, department, basicSalary } = req.body;

    if (!name.trim() || Number(basicSalary) < 0) {
        return res.send("Invalid Input");
    }

    const employees = await readEmployees();

    const newEmployee = {
        id: Date.now(),
        name: name.trim(),
        department: department.trim(),
        basicSalary: Number(basicSalary)
    };

    employees.push(newEmployee);
    await writeEmployees(employees);

    res.redirect('/');
});
// delete by id 

app.get('/delete/:id', async (req, res) => {
    const employees = await readEmployees();
    const filtered = employees.filter(emp => emp.id != req.params.id);
    await writeEmployees(filtered);
    res.redirect('/');
});
// edit by id
app.get('/edit/:id', async (req, res) => {
    const employees = await readEmployees();
    const employee = employees.find(emp => emp.id == req.params.id);
    res.render('edit', { employee });
});

app.post('/edit/:id', async (req, res) => {
    const { name, department, basicSalary } = req.body;

    if (!name.trim() || Number(basicSalary) < 0) {
        return res.send("Invalid Input");
    }

    const employees = await readEmployees();
    const index = employees.findIndex(emp => emp.id == req.params.id);

    employees[index] = {
  ...employees[index],
  name: req.body.name,
  image: req.body.image,
  gender: req.body.gender,
  department: req.body.department,
  basicSalary: Number(req.body.basicSalary),
  notes: req.body.notes

    };

    await writeEmployees(employees);

    res.redirect('/');
});
// server start
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    const employees = await fileHandler.read();
    console.log("Loaded Employees:", employees);
});
