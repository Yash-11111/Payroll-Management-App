const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs").promises;

const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, "employees.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
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

app.get('/delete/:id', async (req, res) => {
    const employees = await readEmployees();
    const filtered = employees.filter(emp => emp.id != req.params.id);
    await writeEmployees(filtered);
    res.redirect('/');
});

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
        name: name.trim(),
        department: department.trim(),
        basicSalary: Number(basicSalary)
    };

    await writeEmployees(employees);

    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
