//var game = DB.games.find(game => game.id == value);
const express = require('express');
const app = express();
const cors = require('cors');

const jwt = require('jsonwebtoken'); // BLIBIOTECA JWT
const secret = 'allowuser'; // KEY SCRETA!
const { json } = require('express');


// MIDDLEWARE
function auth(req,res,next){
    const AuthToken = req.headers['authorization'] 
        if (AuthToken != undefined){
        var bearer = AuthToken.split(' '); // SEPARANDO BUG DO bearer
        var token = bearer[1]; // SELECIONANDO SOMENTE O TOKEN
        
        jwt.verify(token,secret,(err,data) =>{
            if (err){
                res.sendStatus(401);
            }else{
            //  console.log(data);  Conteudo do Token passada pela informação
            req.token = token; // Pegando as informações e passando eles no MIDDLEWARE em variavél req!
            req.log = {id: data.id, email: data.email}; // Pegando as informações e passando eles no MIDDLEWARE em variavél req!
            next()
            }
        })
        }else{
            res.sendStatus(401);
        }
}

app.use(cors()) // TIRANDO A SEGURANÇA
app.use(express.urlencoded({extended: true})) // NECESSÁRIO PARA BUSCAR UM DADO EM UM BODY 
app.use(express.json()); // NECESSÁRIO PARA BUSCAR UM DADO EM UM BODY 

var DB = { // BANCO DE DADOS FALSO
    games: 
    [
        {
            id: 23,
            title: "Call Of Duty",
            year: 2000,
            price: 10,        
        },
        {
            id: 13,
            title: "Assassin's Creed",
            year: 2020,
            price: 60,        
        },
        {
            id: 3,
            title: "Harry Potter",
            year: 2022,
            price: 200,        
        },
        {
            id: 22,
            title: "God Of War",
            year: 2021,
            price: 100,        
        }
    ],
    users: [
        {
            id: 0, 
            name: 'JEAN LEAO',
            email: 'jeanc@gmail.com',
            password: '3499',
        },
        {
            id: 1, 
            name: 'LEAO TESTE',
            email: 'leao@gmail.com',
            password: '3499',
        }
    ]
}


app.get('/games',auth,(req,res) => {
   // console.log(req.log); PEGANDO VALORES DO MIDDLEWARE
    res.statusCode = 200;
    res.json({user: req.log,games: DB})
});

app.get('/game/:id',auth,(req,res) => {
    var id = req.params.id;
    if (isNaN(id)){
        res.sendStatus(400)
    }else{
        var value = parseInt(req.params.id);
        var game = DB.games.find((games) => games.id == value)
        if (game != undefined) {
            res.statusCode = 200;
            res.json(game)
        }else{
            res.sendStatus(404);
        }
    }
});


app.post('/game',auth,(req,res) => {
    const {title, year, price, id} = req.body;
        DB.games.push({
            id,
            title,
            year,
            price
        })
        res.sendStatus(200)
})

app.delete('/game/:id',auth,(req,res) => {
    var del = req.params.id;
    if (isNaN(del)){
        res.sendStatus(400)
    }else{
        var value = parseInt(del);
        var index = DB.games.findIndex((games) => games.id == value)
        var game = DB.games.find((games) => games.id == value)
        if (game == undefined) {
            res.sendStatus(404);
        }else{
            res.statusCode = 200;
            DB.games.splice(index,1)
            res.sendStatus(200)
        }
    }
});


app.put('/game/:id',auth,(req,res) => {
    var id = req.params.id;  
    var {title, price, year} = req.body;
    
    if (isNaN(id)){
        res.sendStatus(400)
    }else{
        var value = parseInt(req.params.id);
        var game = DB.games.find((games) => games.id == value)
        if (game != undefined) {

            if (title != undefined){
                game.title = title;
            }
            if (price != undefined){
                game.price = price;
            }
            if (year != undefined){
                game.year = year;
            }
            
            res.sendStatus(200)
        }else{
            res.sendStatus(404);
        }
    }
})

app.post('/auth',(req,res) => {
    var  { id,name,email,password } = req.body;
    if(email != undefined ){
    var user = DB.users.find((user) => user.email == email);
    if(user != undefined){
        if (user.password == password){
            jwt.sign({id: user.id,email: user.email},secret,{expiresIn:'48h'},(err, token) => { // PASSANDO UMA CRIAÇÃO DE UM JWT PARA UM TOKEN
                if (err){
                    res.status(400)
                    res.json({err:'Falha interna'})
                }else{
                    res.status(200);
                    res.json({token: token})// ENVIANDO UM TOKEN
                }
            })
        }else{
        res.sendStatus(401);
        }

    }   else{
        res.sendStatus(404);
    }
        
    }else{
        res.sendStatus(400);
    }
})

app.listen(1234, () => {
    console.log('Api Rodando')
});