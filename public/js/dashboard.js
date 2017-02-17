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

            var tipoPersona = data.rows[0][5];
            var nombreUsuario = data.rows[0][3] + " " + data.rows[0][1];
            var personId = data.rows[0][0];

            switch (tipoPersona){
                case 0:
                    swal({
                        title:"Advertencia NO AFILIADO NI REFERIDO.",
                        text: "Numero de cedula encontrado, Usuario: " + nombreUsuario,
                        type:"warning",
                        confirmButtonClass: "btn-warning",
                        confirmButtonText: "Reintentar",
                        closeOnConfirm: true
                    });
                    break;
                case 1:
                    swal({
                            title:"Verificacion Exitosa, Tipo: AFILIADO",
                            text: "Usuario: " + nombreUsuario,
                            type:"success",
                            confirmButtonClass: "btn-success",
                            confirmButtonText: "Afiliado",
                            closeOnConfirm: true
                        },
                        function(isConfirm){
                            if (isConfirm) {
                                window.location.href = "/affiliates/" + personId;
                            }
                        });
                    break;
                case 2:
                    swal({
                            title:"Verificacion Exitosa, Tipo: REFERIDO",
                            text: "Usuario: " + nombreUsuario,
                            type:"success",
                            closeOnConfirm: true,
                            showCancelButton: true,
                            cancelButtonClass: "btn-warning",
                            cancelButtonText: "Referido"
                        },
                        function(isConfirm){
                            if (isConfirm) {
                                window.location.href = "/referred/" + personId;
                            }else{
                                window.location.href = "/referred/" + personId;
                            }
                        });
                    break;
                case 3:
                    swal({
                            title:"Verificacion Exitosa, Tipo: AFILIADO Y REFERIDO",
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
                                window.location.href = "/affiliates/" + personId;
                            }else{
                                window.location.href = "/referred/" + personId;
                            }
                        });
                    break;
            }


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