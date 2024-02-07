const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csvtojson");

const porta = 8000;

const app = express();

//ToDo: Ajustar o controle do CORS antes do deploy
app.use(cors());

app.use(express.urlencoded({ extended: true }));


//Requisição de lista de alunos. DEVE exigir um token válido
app.get("/historico/:ticker", (req, res) => {
    const csvFilePath = `./dados/${req.params.ticker}.csv`;
    if (!fs.existsSync(csvFilePath)) {
        res.status(404).send("Ticker não disponível")
    } else {
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                //console.log(jsonObj);
                res.status(200).json(jsonObj);
            })
    }

})

//Requisição de todos os tickers de uma data
app.get("/historico/data/:data", (req, res) => {
    const csvFilePath = `./dados/geral-data.csv`;
    if (!fs.existsSync(csvFilePath)) {
        res.status(404).send("dados indisponíveis")
    } else {
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                //console.log(jsonObj)
                const resultado = jsonObj.filter(cotacao => cotacao.Date === req.params.data);
                if(resultado.length === 0){
                    res.status(404).send("dados indisponíveis")
                }
                res.status(200).json(resultado);
            })
    }
})




app.get("/historico/:ticker/:data", (req, res, next) => {
    const csvFilePath = `./dados/${req.params.ticker}.csv`;
    if (!fs.existsSync(csvFilePath)) {
        res.status(404).send("Ticker não disponível")
    } else {
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                //console.log(jsonObj);
                const resultado = jsonObj.filter(cotacao => cotacao.Date === req.params.data);
                if (resultado.length === 0) {
                    res.status(404).send("Data não disponível")
                } else {
                    res.status(200).json(resultado);
                }
            })
    }

})

//um tiker por um período
app.get("/historico/:ticker/:data1/:data2", (req, res, next) => {
    const csvFilePath = `./dados/${req.params.ticker}.csv`;
    if (!fs.existsSync(csvFilePath)) {
        res.status(404).send("Ticker não disponível")
    } else {
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                //console.log(jsonObj);
                let data1 = new Date(req.params.data1);
                let data2 = new Date(req.params.data2);
                const resultado = jsonObj.filter(cotacao => (new Date(cotacao.Date) >= data1) && (new Date(cotacao.Date) <= data2));
                if (resultado.length === 0) {
                    res.status(404).send("Período não disponível")
                } else {
                    res.status(200).json(resultado);
                }
            })
    }

})


app.listen(porta, () => {
    console.log(`servidor rodando na porta ${porta}`);
})
