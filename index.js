import express from "express";
import gradesRouter from "./routes/grades.js";
import {promises as fs} from "fs";

const {readFile, writeFile} = fs;

const app = express();
app.use(express.json());
app.use("/grade", gradesRouter);

global.fileName="grades.json";

app.listen(3000, () =>{
  console.log("API Started!")
});

app.get("/consulta", async (req, res) => {
  try {
    let grade = req.body;
   
    const data = JSON.parse(await readFile(global.fileName));
    
    data.grades = data.grades.filter(
      alunoId => alunoId.subject === grade.subject && alunoId.type === grade.type);
    
      console.log(grade.subject);
    
    const total = data.grades.reduce((accumulator, current)=>{
      return accumulator + current.value;
  
    }, 0);

   res.send("Total da nota: "+total+" - Média das notas: "+total/parseInt(data.grades.length));
   

    
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

app.get("/consultaMaior", async (req, res) => {
  try {
    let grade = req.body;
   
    const data = JSON.parse(await readFile(global.fileName));
    
    data.grades = data.grades.filter(
      alunoId => alunoId.subject === grade.subject && alunoId.type === grade.type);

   data.grades = data.grades.sort((a, b) => {
      return b.value - a.value;
    });

    
    res.send(data.grades);
    
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

