import express from "express";
import {promises as fs} from "fs";

const {readFile, writeFile} = fs;

const router = express.Router();

router.post("/", async (req, res) =>{
  try {
    let grade = req.body;
    console.log(req.body);

    const data = JSON.parse(await readFile(global.fileName));

    grade = {
      id: data.nextId++,
      student: grade.student,
      subject: grade.subject,
      type: grade.type,
      value: grade.value,
      timestamp: new Date()
    }

    data.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    
    res.send(grade);

  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

router.put("/", async (req, res) =>{
  try {
    let grade = req.body;

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.grades.findIndex(a => a.id === grade.id);

    data.grades[index].id = grade.id;
    data.grades[index].student = grade.student;
    data.grades[index].subject = grade.subject;
    data.grades[index].type = grade.type;
    data.grades[index].value = grade.value;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(grade);
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

router.delete("/:id", async (req, res) =>{
  const data = JSON.parse(await readFile(global.fileName));
  data.grades = data.grades.filter(
    grade => grade.id !== parseInt(req.params.id));
  
  await writeFile(global.fileName, JSON.stringify(data, null, 2));
  res.end();
});

router.get("/:id", async (req, res) => {
  try {

    const data = JSON.parse(await readFile(global.fileName));
    const grade = data.grades.filter(
      grade => grade.id === parseInt(req.params.id));
    
   res.send(grade);
    
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

router.get("/consulta", async (req, res) => {
  console.log("Entrou aqui");
  res.send("Ola");
});

router.get("/", async (req, res) => {
  try {
    let grade = req.body;

    const data = JSON.parse(await readFile(global.fileName));

    data.grades = data.grades.filter(
      gradex => gradex.student === grade.student && gradex.subject === grade.subject);
    
    const total = data.grades.reduce((accumulator, current)=>{
      return accumulator + current.value;
  
    }, 0);

   res.send("total da nota: "+total);
    
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

router.get("/", async (req, res) => {
  try {
    let grade = req.body;
   
    const data = JSON.parse(await readFile(global.fileName));
    data.grades = data.grades.filter(
      gradex => gradex.subject === grade.subject && gradex.type === grade.type);
    const total = data.grades.reduce((accumulator, current)=>{
      return accumulator + current.value;
  
    }, 0);


   res.send("total da nota: "+total);
    
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

export default router;