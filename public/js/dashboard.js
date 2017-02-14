// Limpiar input
function LimpiarInput() {
    $('#documento').val('').focus();
}

// Llamados al endpoint de carga de datos iniciales+
function ConsultarCedula() {
    var cedula = $('#documento').val();
    if(typeof cedula === 'undefined' || cedula === ''){
        swal({
            title:"Numero de cedula requerido.",
            message: "",
            type:"info",
            confirmButtonClass: "btn-info",
            confirmButtonText: "Reintentar",
            closeOnConfirm: true
        });
        return;
    }
    $.ajax({
        method: "GET",
        url: "/search/ajax?cedula=" + cedula
    })
        .done(function (data) {
            if(typeof data.code !== 'undefined' || data.code === '' || data.code === 2){
                swal({
                    title:"Numero de cedula no encontrado.",
                    type:"warning",
                    confirmButtonClass: "btn-warning",
                    confirmButtonText: "Reintentar",
                    closeOnConfirm: true
                });
                return;
            }
            if(typeof data.rows === 'undefined' || data.rows[0].length === 0){
                swal({
                    title:"Error verificando el numero de cedula.",
                    type:"error",
                    confirmButtonClass: "btn-error",
                    confirmButtonText: "Reintentar",
                    closeOnConfirm: true
                });
                return;
            }

            var nombreUsuario = data.rows[0][3] + " " + data.rows[0][1];

            swal({
                    title:"Verificacion Exitosa",
                    text: "Usuario: " + nombreUsuario,
                    type:"success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Afiliado",
                    closeOnConfirm: true,
                    showCancelButton: true,
                    cancelButtonClass: "btn-warning",
                    cancelButtonText: "Referido"
                },
                function(isConfirm){
                    if (isConfirm) {
                        window.location.href = "/affiliates";
                    }else{
                        window.location.href = "/referred";
                    }
                });
        });
}

function validarModal() {
    swal({
        title:"Verificacion Exitosa",
        message: "",
        type:"success",
        confirmButtonClass: "btn-success",
        confirmButtonText: "Afiliado",
        closeOnConfirm: true,
        showCancelButton: true,
        cancelButtonClass: "btn-warning",
        cancelButtonText: "Referido"
    },
    function(isConfirm){
        if (isConfirm) {
            window.location.href = "/affiliates";
        }else{
            window.location.href = "/referred";
        }
    });
}