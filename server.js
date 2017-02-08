const express = require("express");
const bp = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const porta = process.env.PORT || 8080;
const usuario = require("./app/models/usuario");

const app = express();
const router = express.Router();
const routerPadrao = express.Router();

routerPadrao.get("/", function(req, res){
    res.send("<h1>Bem-vindo!</h1>");
});

router.use(function(req, res, next){
    console.log("Alguém está usando nossa aplicação!");
    next();
});

router.get("/", function(req, res){
    res.json({mensagem: "Bem-vindo a nossa API!"});
});

router.route("/usuarios")//aqui vai ser chamado em /api/usuarios
    .post(function(req, res){
        var usu = new usuario();
        usu.nome = req.body.nome;
        usu.senha = req.body.senha;
        usu.usuario = req.body.usuario;
        usu.save(function(erro){
            if(erro){
               return res.json({"mensagem": "Houve um erro ao salvar o usuário.", "erro" : erro});
            }
            return res.json({"mensagem": "Usuário salvo."});
        });
    })
    .get(function(req, res){
        usuario.find(function(erro, usuarios){
            if(erro){
                res.send(erro);
            }
            res.json(usuarios);
        });
    });


router.route("/usuarios/:id")
    .get(function(req, res){
        usuario.findById(req.params.id, function(erro, usu){
            if(erro){
                res.send(erro);
            }else{
                res.json(usu);
            }
        });
    })
    .put(function(req, res){
        usuario.findById(req.params.id, function(erro,usu){
            if(erro){
                res.send(erro);
            }else{
                if(req.body.nome){
                    usu.nome = req.body.nome;
                }
                if(req.body.senha){
                    usu.senha = req.body.senha;
                }
                if(req.body.usuario){
                    usu.usuario = req.body.usuario;
                }
                usu.save(usu, function(erro){
                    if(erro){
                        res.send(erro);
                    }else{
                        res.json({"mensagem": "Usuário atualizado."});
                    }
                });
            }
        });
    })
    .delete(function(req, res){
         usuario.remove({
                _id: req.params.id
             }, function(erro, usu){
                if(erro){
                    res.send(erro);
                }else{
                    res.json({"mensagem" : "Usuário removido."});
                }
             });    
    });
    



app.use(bp.urlencoded({extended: true}));
app.use(bp.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/", routerPadrao);
app.use("/api", router); //quando eu registrei aqui, o roteador vai ser chamado a partir de /api.

mongoose.connect("mongodb://localhost:27017/db_api");

mongoose.connection.on("error", function(erro){
    console.log("Não foi possível conectar ao banco de dados");
});

mongoose.connection.on("connected", function(){
    console.log("Conectado ao banco de dados");
});

app.listen(porta, function(){
    console.log("Servidor on-line na porta " + porta);
});