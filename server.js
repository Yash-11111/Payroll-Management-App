const express = require('express');
const path = require('path');
const fileHandler = require('./modules/fileHandler');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Log employees when server starts
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    const employees = await fileHandler.read();
    console.log("Loaded Employees:", employees);
});



app.get('/', async (req, res) => {
    const employees = await fileHandler.read();
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

    const employees = await fileHandler.read();

    const newEmployee = {
        id: Date.now(),
        name: name.trim(),
        department: department.trim(),
        basicSalary: Number(basicSalary)
    };

    employees.push(newEmployee);
    await fileHandler.write(employees);

    res.redirect('/');
});



app.get('/delete/:id', async (req, res) => {
    const employees = await fileHandler.read();

    const filtered = employees.filter(emp => emp.id != req.params.id);

    await fileHandler.write(filtered);

    res.redirect('/');
});


app.get('/edit/:id', async (req, res) => {
    const employees = await fileHandler.read();
    const employee = employees.find(emp => emp.id == req.params.id);

    res.render('edit', { employee });
});

app.post('/edit/:id', async (req, res) => {
    const { name, department, basicSalary } = req.body;

    if (!name.trim() || Number(basicSalary) < 0) {
        return res.send("Invalid Input");
    }

    const employees = await fileHandler.read();
    const index = employees.findIndex(emp => emp.id == req.params.id);

    employees[index] = {
        ...employees[index],
        name: name.trim(),
        department: department.trim(),
        basicSalary: Number(basicSalary)
    };

    await fileHandler.write(employees);

    res.redirect('/');
});
