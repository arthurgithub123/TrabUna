"use strict";

$(document).ready(function() 
{

});


function Salvar() 
{
    //Recupera o último valor do id
    var id = JSON.parse(localStorage.getItem("id"));

    //Array com as parcelas
    var qtd_parcelas = 12 * $("#tempo").val();
    
    var parcelas = [];
    for(var i=0; i < qtd_parcelas; i++)
    {
        parcelas[i] = $("#meta").val();
    }    

    var metas = [];

    //Meta do usuário
    var Meta = 
    {
        ID:                     ++id,
        DESCRICAO:              $("#descricao").val(),
        VALOR:                  $("#meta").val(),
        TEMPO:                  $("#tempo").val(),
        PARCELAS_PAGAS:         0,
        VALOR_META_RESTANTE:    $("#meta").val(),
        QTD_PARCELAS:           12 * $("#tempo").val(),
        PARCELAS:               parcelas
    };

    // 1 usuário possui N metas
    metas.push(Meta);

    var email = $("#email").val(); 
    var Usuario = 
    {
        EMAIL: email,
        META: metas
    };

    //Salva objeto no localStorage
    localStorage.setItem(email, JSON.stringify(Usuario));

    //Salva o valor do id no localStorage
    localStorage.setItem("id", JSON.stringify(id));

    Logar(email);

    $("#hiddenEmail").val(email);

    $("[type='text']").val("");

    //Lista uma tabela com as metas
    ListarMetas(email);
}

//Lista tabela com as metas do usuário logado
function ListarMetas(email) 
{
    var usuarioLogado = JSON.parse(localStorage.getItem(email));

    var txtTabela = 
    "<hr />" +
    "<table class='table table-bordered'>" +
        "<tr>" +
            "<th><input type='checkbox' id='chkTodos' onchange='chkTodos()' /></th>" +
            "<th>Valor</th>" +
            "<th>Descrição</th>" +
            "<th><input type='button' value='Excluir Selecionados' class='btn btn-danger btn-sm' onclick='ExcluirSelecionados()'></th>" +
        "</tr>";
    for(var i=0; i < usuarioLogado.META.length; i++)
    {
        txtTabela +=
        "<tr id='" + usuarioLogado.META[i].ID + "'>" +
            "<td><input type='checkbox' /></td>" +
            "<td>" + usuarioLogado.META[i].VALOR + "</td>" +
            "<td class='tdDescricao'>" + usuarioLogado.META[i].DESCRICAO + "</td>" +
            "<td><input type='button' value='Info Meta' class='btn btn-default btn-sm' onclick='MostrarInfoMeta(" + usuarioLogado.META[i].ID + ")' /> <input type='button' value='Excluir' class='btn btn-danger btn-sm' onclick='Excluir(" + usuarioLogado.META[i].ID + ")' />" +
        "</td>";
    }

    //Coloca na #divListaMetas a tabela e esta é renderizada
    $("#divListaMetas").html(txtTabela);   

    //Limita a quantidade de caracteres da descricao que aparecerá em cada .tdDescricao
    $(".tdDescricao").each(function(){

        var textoTdDescricao = $(this).text();
        var qtdCaracteres = textoTdDescricao.length;

        if(qtdCaracteres > 37)
        {
            textoTdDescricao = textoTdDescricao.substring(0,36) + " ...";
            $(this).text(textoTdDescricao);
        }  
    });
}

//Verifica cada chave do localStorage para saber se há o email
//e retorna true ou false
function VerificarEmail(email)
{
    var existeEmail = false;

    for(var i=0; i < localStorage.length; i++)
    {
        if(localStorage.key(i) == email)
        {
            existeEmail = true;
            i = localStorage.length;
        }
    }

    return existeEmail;
}

//Se o email estiver cadastrado entra na conta. Se não, dá um alert informando que o email não está cadastrado
function PesquisarEmail() 
{
    var email = $("#emailPesquisa").val();

    if(!VerificarEmail(email))
        alert("Este email não está cadastrado");
    else
    {
        Logar(email);

        $("#hiddenEmail").val(email);

        ListarMetas(email);
    }

}

//Mostra email logado, esconde campo para pesquisar email, campo email e altera o botão Salvar
function Logar(email) 
{
    //Esconde a divPesquisarEmail e o campo para o cadastro de email
    $("#divPesquisarEmail").hide();
    $("form .row:eq(0)").hide();

    //Mostra o email que está logado
    $("#divLogadoComo div:eq(1)").html("Entrou como <b>" + email + "</b> <input type='button' value='Sair' class='btn btn-danger btn-xs' onclick='Sair()'>");
    
     //Muda o value e onclick do botão Salvar
     $("#btnSalvar").attr("value","Salvar Nova Meta");
     $("#btnSalvar").attr("onclick","SalvarNovaMeta()");
}

//Salva metas no email logado
function SalvarNovaMeta() 
{
    //Recupera valor do id
    var id = JSON.parse(localStorage.getItem("id"));

    //Recupera o Usuário no localStorage
    var email = $("#hiddenEmail").val();
    var usuario = JSON.parse(localStorage.getItem(email));

    var qtd_parcelas = 12 * $("#tempo").val();
    var parcelas = [];
    for(var i=0; i < qtd_parcelas; i++)
    {
        parcelas[i] = $("#meta").val();
    }

    var novaMeta = {
        ID:                     ++id,
        DESCRICAO:              $("#descricao").val(),
        VALOR:                  $("#meta").val(),
        TEMPO:                  $("#tempo").val(),
        PARCELAS_PAGAS:         0,
        VALOR_META_RESTANTE:    $("#meta").val(),
        QTD_PARCELAS:           qtd_parcelas,
        PARCELAS:               parcelas
    }

    //Adiciona a nova meta ao usuário
    usuario.META.push(novaMeta);

    //Salva o usuário no localStorage
    localStorage.setItem(email, JSON.stringify(usuario));

    //Salva o id no localStorage
    localStorage.setItem("id", JSON.stringify(id));

    $("[type='text']").val("");

    ListarMetas(email);
}

//Seleciona todos os checkbox
function chkTodos()
{
    $(":checkbox").not("#chkTodos").each(function(){
        if(this.checked)
            this.checked = false;
        else
            this.checked = true;
    });
}

function PossuiValor(valorElemento) 
{
    if(valorElemento == "" || valorElemento == null || valorElemento == undefined)
        return false;
    
    return true;
}

//Exclui uma meta de uma linha da tabela somente se o checkbox desta linha estiver marcado
function Excluir(idMeta)
{  
    var emailLogado = $("#hiddenEmail").val();
    //var usuarioLogado;

    var chkMarcado = $(":checkbox", $("#" + idMeta)).is(":checked");

    //Recupera usuário do localStorage para excluir sua meta que tem o id do parâmetro
    if(chkMarcado)
    {
        var usuarioLogado = JSON.parse(localStorage.getItem(emailLogado)); 
    
        //Exclui a meta do usuário e salva no localStorage
        for(var i=0; i < usuarioLogado.META.length; i++)
            if(usuarioLogado.META[i].ID == idMeta)
            {
                usuarioLogado.META.splice(i,1);
                
                localStorage.setItem(emailLogado, JSON.stringify(usuarioLogado));
            }
        
        ListarMetas(emailLogado);
    }
        
    
    

}

function ExcluirSelecionados()
{
    var emailLogado = $("#hiddenEmail").val();
    
    var usuarioLogado = JSON.parse(localStorage.getItem(emailLogado));

    $(":checked").not("#chkTodos").each(function(){
        
        var idMeta = $(this).parent().parent().attr("id");

        for(var i=0; i < usuarioLogado.META.length; i++)
            if(usuarioLogado.META[i].ID == idMeta)
            {
                usuarioLogado.META.splice(i,1);

                localStorage.setItem(emailLogado, JSON.stringify(usuarioLogado));
            }
    });

    ListarMetas(emailLogado);
}

//Mostra info e cadastro das parcelas da meta e também o gráfico
function MostrarInfoMeta(idMeta) 
{
    var emailLogado = $("#hiddenEmail").val();

    var usuarioLogado = JSON.parse(localStorage.getItem(emailLogado));

    var meta;
    
    for(var i=0; i < usuarioLogado.META.length; i++)
        if(usuarioLogado.META[i].ID == idMeta)
            meta = usuarioLogado.META[i];

    if($("#divInfoMeta").length)
        $("#divInfoMeta").remove();

    //Adiciona a divListaMetas na qual ficarão as informações referentes a meta
    //Mostra info da meta: descricao, tempo, parcelas pagas, valor restante, quantidade parcelas
    $("#divListaMetas").parent().after
    (
        '<div class="row form-group" id="divInfoMeta">' +
            '<div class="col-md-3"></div>' +
            '<div class="col-md-6">' +
                '<div class="list-group">' +
                    '<a href="#" class="list-group-item">' +
                        '<h4 class="list-group-item-heading text-center">Descrição Meta</h4>' +
                        '<p class="list-group-item-text text-center" style="word-wrap: break-word">' + // CSS para o texto não sair para fora da div
                            meta.DESCRICAO                 +
                        '</p>' +
                    '</a>' +
                    '<a href="#" class="list-group-item">' +
                        '<h4 class="list-group-item-heading text-center">Tempo em Anos</h4>' +
                        '<p class="list-group-item-text text-center">' +
                            meta.TEMPO                 +
                        '</p>' +
                    '</a>' +
                    '<a href="#" class="list-group-item">' +
                        '<h4 class="list-group-item-heading text-center">Quantidade de parcelas</h4>' +
                        '<p class="list-group-item-text text-center">' +
                            meta.QTD_PARCELAS                 +
                        '</p>' +
                    '</a>' +
                    '<a href="#" class="list-group-item">' +
                        '<h4 class="list-group-item-heading text-center">Parcelas Pagas</h4>' +
                        '<p class="list-group-item-text text-center">' +
                            meta.PARCELAS_PAGAS                 +
                        '</p>' +
                    '</a>' +
                    '<a href="#" class="list-group-item">' +
                        '<h4 class="list-group-item-heading text-center">Valor Restante</h4>' +
                        '<p class="list-group-item-text text-center">' +
                            meta.VALOR_META_RESTANTE                 +
                        '</p>' +
                    '</a>' +
                '</div>' +
            '</div>' +
            '<div class="col-md-3"></div>' +
        '</div>'
    );

    //Itens da lista recebem classe active e ficam destacados quando usuário passa o cursor sobre eles.
    $(".list-group-item").hover(function(){

        $(this).addClass("active");
    }, function(){
    
        $(this).removeClass("active");
    });

    //Mostra valores que o usuário conseguiu de cada mês

    //Mostra formulário para colocar valor adquirido

    //Mostra gráfico
}

function Sair() 
{
    location.reload();
}