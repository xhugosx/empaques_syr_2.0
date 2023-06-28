function abrirCarpeta(elemento)
{
    var id = "#"+elemento.firstChild.nextElementSibling.id;

    $(".fa-folder").removeClass('fa-folder-open')
    $(id).toggleClass('fa-folder-open');

    
}