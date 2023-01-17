function setAgregarPedidoLamina()
{
    
    servidorPost("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/add.php",getAgregarPedidoLamina,formData)
}
function getAgregarPedidoLamina(respuesta)
{
    alert("esto: "+respuesta.responseText);
}