const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

var usuarioSchema = new mongoose.Schema({
    nome: String,
    usuario: {type: String, required: true, index: {unique: true}},
    senha: {type: String, required: true, selected: false},
});

//posso chamar uma função que vai ser executanda antes (pre) de salvar ("save")
usuarioSchema.pre("save", function(next){
    var usuario = this;
    if(!usuario.isModified("senha")){
        return next();
    }

    bcrypt.hash(usuario.senha, null, null, function(erro, hash){
        if(erro){
            return next(erro);
        }
        usuario.senha = hash;
        next();
    });    
});

usuarioSchema.methods.compararSenha = function(senha){
    var usuario = this;
    return bcrypt.compareSync(this.senha, senha);
};

module.exports = mongoose.model("Usuario", usuarioSchema);