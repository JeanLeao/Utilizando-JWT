//MODIFICANDO PARA AUTH DO JWT

var axiosConfig= {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("Token")
    }
}



function entrar(){
    var emailField = document.getElementById("email");
    var passwordField = document.getElementById("password")
    var email = emailField.value;
    var password = passwordField.value
    

    axios.post('http://localhost:1234/auth',{
        email,
        password}).then((r)=>{
        var token = r.data.token
        localStorage.setItem("Token", token)
    }).catch((err)=>{
        alert(err)
        console.log(err)
    })
}

// Function of application
function createGame(){ // FUNÇÃO DE CRIAR O GAME
    var title = document.getElementById("title");
    var year = document.getElementById("year");
    var price = document.getElementById("price");

    var game = {
        title: title.value,
        year: year.value,
        price: price.value
    }

    axios.post('http://localhost:1234/game',game,axiosConfig).then((r)=>{
            alert('Game Cadastrado!');
    }).catch((err)=>{
        console.log(err)
    })
}

function deleteGame(list){  // FUNÇÃO DE DELETE NO GAME
    var name = list.getAttribute("data-id");
    console.log(name)
    axios.delete('http://localhost:1234/game/'+`${name}`,axiosConfig).then(() => {
        alert('game deletado');
    }).catch((err) => {
        console.log(err)
    })
}

function editGame(list){  // FUNÇÃO DE EDIT NO GAME
    // BUSCANDO DATA NO HTML GERADO PELO FOREACH
    var id = list.getAttribute("data-id");
    let name = list.getAttribute("data-title");
    let price = list.getAttribute("data-price");
    let year = list.getAttribute("data-year");

    //ADICIONANDO VALORES IN CLICK
    let IdField = document.getElementById("idEdit");
    IdField.value = id; // PEGANDO DADOS DE CADA FIELD

    let nameField = document.getElementById("titleEdit");
    nameField.value = name; // PEGANDO DADOS DE CADA FIELD

    let priceField = document.getElementById("priceEdit");
    priceField.value = price; // PEGANDO DADOS DE CADA FIELD

    let yearField = document.getElementById("yearEdit");
    yearField.value = year; // PEGANDO DADOS DE CADA FIELD

}


function UpdateClick(){  // FAZENDO O UPDATE PELO CLICK DO BOTÃO

    let IdField = document.getElementById("idEdit");
    let nameField = document.getElementById("titleEdit");
    let priceField = document.getElementById("priceEdit");
    let yearField = document.getElementById("yearEdit");

    let game = {
        title: nameField.value,
        year: yearField.value,
        price: priceField.value
    }

    axios.put('http://localhost:1234/game/'+IdField.value,game,axiosConfig).then((r)=>{
        if(r.statusCode == 200){
            alert('Game Editado!');
        }
    }).catch((err)=>{
        console.log(err)
    })

}


    axios.get('http://localhost:1234/games',axiosConfig).then((res) => { // RETORNANDO OS DADOS DO GAME
    var games = res.data.games.games;   
    var list = document.getElementById("games");
    games.forEach((game) => {  // INSERINDO OS ELEMENTOS
        var item = document.createElement("li");
        item.setAttribute("data-id", game.id) // SETANDO ATRIBUTOS EM CADA ELEMENTO
        item.setAttribute("data-title", game.title) // SETANDO ATRIBUTOS EM CADA ELEMENTO
        item.setAttribute("data-year", game.year) // SETANDO ATRIBUTOS EM CADA ELEMENTO
        item.setAttribute("data-price", game.price) // SETANDO ATRIBUTOS EM CADA ELEMENTO
        item.innerHTML =  game.title + '- $' +game.price;
        
        var deleteBtn = document.createElement("button")
        deleteBtn.innerHTML = "Deletar"
        deleteBtn.addEventListener("click", () => deleteGame(item)) // REMOVENDO BUG
        item.appendChild(deleteBtn)
        
        var attBtn = document.createElement("button")
        attBtn.innerHTML = "Atualizar"
        attBtn.addEventListener("click", () => editGame(item)) // REMOVENDO BUG
        item.appendChild(attBtn)
        
        
        list.appendChild(item)
        });
    }).catch((err) => {
        console.log(err)
        
    })
