// Llamados al endpoint de carga de datos iniciales+
function CargarDatos() {
    $.ajax({
        method: "GET",
        url: "/settings/cities/ajax"
    })
        .done(function (data) {
            var iterador = data;
            delete iterador.metaData;
            var trHTML = '';
            $.each(iterador, function (i, abreviData) {
                for (i = 0; i < data.rows.length; i++) {
                    trHTML += '<tr class="odd gradeX">' +
                        '<td>' + data.rows[i][0] + '</td>' +
                        '<td>' + data.rows[i][1] + '</td>' +
                        '<td>' + data.rows[i][2] + '</td>' +
                        '<td>' +
                        '<div style="text-align:center" >' +
                        '<a href="/settings/cities/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle btn-sm purple">' +
                        '<i class="fa fa-edit"></i> Editar </a>' +
                        '<a onclick="EliminarModal(' + data.rows[i][0].toLowerCase() + ')" class="btn btn-outline btn-circle dark btn-sm black">' +
                        '<i class="fa fa-trash-o"></i> Eliminar </a>' +
                        '</div>' +
                        '</td>' +
                        '</tr>';
                }
            });

            $('#resultados').empty().append(trHTML);

            if (App.isAngularJsApp() === false) {
                TableDatatablesManaged.init();
            }
        });
}

function GuardarModalNuevo() {
    var evitarSubmit = false;
    var $idrol = $('#txtid').val();
    var $rol = $('#txtvalue').val();
    var $iddepartamento = $('#txtiddepartamento').val();

    // Validar si envio vacio
    if ($idrol === '' || $rol === '' || $iddepartamento === '') {
        swal({
            title: "Datos Incompletos",
            message: "",
            type: "warning",
            confirmButtonText: "Ok",
            confirmButtonClass: "btn-warning",
            closeOnConfirm: true
        });
        return evitarSubmit;
    }

    // Validar si el id existe.
    $.ajax({
        method: "GET",
        url: "/settings/cities/check/" + $idrol + "/ajax"
    })
        .done(function (data) {
            console.log(data);
            // Varifico si viene el codigo de retorno o un elemento
            if (typeof data.code !== 'undefined') {
                // SI no existe el elemento los inserto en la BD.
                $.ajax({
                    method: "POST",
                    url: "/settings/cities/ajax",
                    data: {
                        "id": $idrol,
                        "value": $rol,
                        "iddepartamento" : $iddepartamento
                    }
                })
                    .done(function (data) {
                        swal({
                                title: data.message,
                                message: "",
                                type: "success",
                                confirmButtonText: "Salir",
                                confirmButtonClass: "btn-warning",
                                showCancelButton: true,
                                cancelButtonClass: "btn-success",
                                cancelButtonText: "Agregar otro municipio",
                                closeOnConfirm: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    window.location.href = "/settings/cities";
                                } else {
                                    window.location.href = "/settings/cities/new";
                                }
                            });
                    });
                return evitarSubmit;
            } else if (typeof data.rows !== 'undefined') {
                swal({
                    title: "El Id ya existe!",
                    text: "Desea actualizar el valor actual de: " + data.rows[0][1] + " por " + $rol,
                    type: "info",
                    confirmButtonText: "Actualizar",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    cancelButtonText: "Cancelar",
                    showLoaderOnConfirm: true
                }, function () {
                    $.ajax({
                        method: "PUT",
                        url: "/settings/cities/" + $idrol + "/ajax",
                        data: {
                            "value": $rol,
                            "iddepartamento" : $iddepartamento
                        }
                    })
                        .done(function (data) {
                            setTimeout(function () {
                                swal({
                                        title: data.message,
                                        message: "",
                                        type: "success",
                                        confirmButtonText: "Salir",
                                        confirmButtonClass: "btn-warning",
                                        showCancelButton: true,
                                        cancelButtonClass: "btn-success",
                                        cancelButtonText: "Agregar otro municipio",
                                        closeOnConfirm: true
                                    },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            window.location.href = "/settings/cities";
                                        } else {
                                            window.location.href = "/settings/cities/new";
                                        }
                                    });
                            }, 1000);
                        });
                });
                return evitarSubmit;
            } else {
                swal({
                    title: "Error guardando el municipio",
                    message: "Comuniquese con su administrador.",
                    type: "error",
                    confirmButtonText: "Ok",
                    confirmButtonClass: "btn-error",
                    closeOnConfirm: true
                });
            }
        });
    return evitarSubmit;
}

function CancelarModalNuevo() {
    var $idrol = $('#txtid').val();
    var $rol = $('#txtvalue').val();
    var $iddepartamento = $('#txtiddepartamento').val();
    if ($idrol !== '' || $rol !== '' || $iddepartamento !== '') {
        swal({
                title: "Desea salir sin guardar cambios?",
                message: "",
                type: "warning",
                closeOnConfirm: true,
                confirmButtonText: "Salir",
                confirmButtonClass: "btn-warning",
                showCancelButton: true,
                cancelButtonText: "Continuar",
                cancelButtonClass: "btn-success"
            },
            function (isConfirm) {
                if (isConfirm) {
                    window.location.href = "/settings/cities";
                }
            });
    } else {
        window.location.href = "/settings/cities";
    }
}

function ActualizarModalEditar() {
    var evitarSubmit = false;
    var $idrol = $('#txtid').val();
    var $rol = $('#txtvalue').val();
    var $iddepartamento = $('#txtiddepartamento').val();

    // Validar si envio vacio
    if ($idrol === '' || $rol === '' || $iddepartamento === '') {
        swal({
            title: "Datos Incompletos",
            message: "",
            type: "warning",
            confirmButtonText: "Ok",
            confirmButtonClass: "btn-warning",
            closeOnConfirm: true
        });
        return evitarSubmit;
    }

    // Envio actualizar

    $.ajax({
        method: "PUT",
        url: "/settings/cities/" + $idrol + "/ajax",
        data: {
            "value": $rol,
            "iddepartamento" : $iddepartamento
        }
    })
        .done(function (data) {
            swal({
                    title: data.message,
                    message: "",
                    type: "success",
                    confirmButtonText: "Salir",
                    confirmButtonClass: "btn-warning",
                    showCancelButton: true,
                    cancelButtonClass: "btn-success",
                    cancelButtonText: "Continuar",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        window.location.href = "/settings/cities";
                    }
                });
        });
    return evitarSubmit;
}

function CancelarModalEditar() {
    swal({
            title: "Desea salir sin guardar cambios?",
            message: "",
            type: "warning",
            closeOnConfirm: true,
            confirmButtonText: "Salir",
            confirmButtonClass: "btn-warning",
            showCancelButton: true,
            cancelButtonText: "Continuar",
            cancelButtonClass: "btn-success"
        },
        function (isConfirm) {
            if (isConfirm) {
                window.location.href = "/settings/cities";
            }
        });
}

function EliminarModal(id) {
    // Validar si envio vacio
    if (id === '' || typeof id === 'undefined' || id === null) {
        swal({
            title: "Datos Incompletos",
            message: "",
            type: "warning",
            confirmButtonText: "Ok",
            confirmButtonClass: "btn-warning",
            closeOnConfirm: true
        });
        return;
    }

    // Envio eliminar

    swal({
        title: "Se va eliminar el municipio id: " + id,
        text: "Desea continuar con esta operacion?",
        type: "info",
        confirmButtonText: "Eliminar",
        confirmButtonClass: "btn-warning",
        showCancelButton: true,
        closeOnConfirm: false,
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true
    }, function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                method: "DELETE",
                url: "/settings/cities/" + id + "/ajax"
            })
                .done(function (data) {
                    setTimeout(function () {
                        swal({
                                title: data.message,
                                message: "",
                                type: "success",
                                confirmButtonText: "Salir",
                                confirmButtonClass: "btn-warning",
                                closeOnConfirm: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    window.location.href = "/settings/cities";
                                }
                            });
                    }, 1000);
                });
        }
    });
}