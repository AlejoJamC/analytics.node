// Llamados al endpoint de carga de datos iniciales+
function CargarDatos() {
    $.ajax({
        method: "GET",
        url: "/settings/abbreviations/ajax"
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
                        '<td>' +
                        '<div style="text-align:center" >' +
                        '<a href="/settings/abbreviations/' + data.rows[i][0].toString().toLowerCase().trim() + '" class="btn btn-outline btn-circle btn-sm purple">' +
                        '<i class="fa fa-edit"></i> Editar </a>' +
                        '<a onclick="EliminarModal(\'' + data.rows[i][0].toString().toLowerCase().trim() + '\')" class="btn btn-outline btn-circle dark btn-sm black">' +
                        '<i class="fa fa-trash-o"></i> Eliminar </a>' +
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
    var $id = $('#txtid').val();
    var $value = $('#txtvalue').val();
    $id = $id.trim();
    $value = $value.trim();

    // Validar si envio vacio
    if ($id === '' || $value === '') {
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
        url: "/settings/abbreviations/check/" + $id + "/ajax"
    })
        .done(function (data) {
            // Varifico si viene el codigo de retorno o un elemento
            if (typeof data.code !== 'undefined') {
                // SI no existe el elemento los inserto en la BD.
                $.ajax({
                    method: "POST",
                    url: "/settings/abbreviations/ajax",
                    data: {
                        "id": $id,
                        "value": $value
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
                                cancelButtonText: "Agregar otra abreviatura",
                                closeOnConfirm: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    window.location.href = "/settings/abbreviations";
                                } else {
                                    window.location.href = "/settings/abbreviations/new";
                                }
                            });
                    });
                return evitarSubmit;
            } else if (typeof data.rows !== 'undefined') {
                swal({
                    title: "El Id ya existe!",
                    text: "Desea actualizar el valor actual de: " + data.rows[0][1] + " por " + $value,
                    type: "info",
                    confirmButtonText: "Actualizar",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    cancelButtonText: "Cancelar",
                    showLoaderOnConfirm: true
                }, function () {
                    $.ajax({
                        method: "PUT",
                        url: "/settings/abbreviations/" + $id + "/ajax",
                        data: {
                            "value": $value
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
                                        cancelButtonText: "Agregar otra abreviatura",
                                        closeOnConfirm: true
                                    },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            window.location.href = "/settings/abbreviations";
                                        } else {
                                            window.location.href = "/settings/abbreviations/new";
                                        }
                                    });
                            }, 1000);
                        });
                });
                return evitarSubmit;
            } else {
                swal({
                    title: "Error guardando la abreviatura",
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
    var $id = $('#txtid').val();
    var $value = $('#txtvalue').val();
    $id = $id.trim();
    $value = $value.trim();
    if ($id !== '' || $value !== '') {
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
                    window.location.href = "/settings/abbreviations";
                }
            });
    } else {
        window.location.href = "/settings/abbreviations";
    }
}

function ActualizarModalEditar() {
    var evitarSubmit = false;
    var $id = $('#txtid').val();
    var $value = $('#txtvalue').val();
    $id = $id.trim();
    $value = $value.trim();

    // Validar si envio vacio
    if ($id === '' || $value === '') {
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
        url: "/settings/abbreviations/" + $id + "/ajax",
        data: {
            "value": $value
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
                        window.location.href = "/settings/abbreviations";
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
                window.location.href = "/settings/abbreviations";
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
        title: "Se va eliminar la abreviatura id: " + id,
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
                url: "/settings/abbreviations/" + id + "/ajax"
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
                                    window.location.href = "/settings/abbreviations";
                                }
                            });
                    }, 1000);
                });
        }
    });
}