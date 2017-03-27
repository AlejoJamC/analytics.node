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
                        '<a href="/settings/abbreviations/' + data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle btn-sm purple">' +
                        '<i class="fa fa-edit"></i> Editar </a>' +
                        '<a onclick="EliminarRolModal(' + data.rows[i][0].toLowerCase() + ')" class="btn btn-outline btn-circle dark btn-sm black">' +
                        '<i class="fa fa-trash-o"></i> Eliminar </a>' +
                        '<div style="text-align:center" >' +
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

function NuevoModal() {
    swal({
            title: "Crear una nueva abreviatura",
            message: "",
            type: "success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "Crear",
            closeOnConfirm: true,
            showCancelButton: true,
            cancelButtonClass: "btn-warning",
            cancelButtonText: "Cancelar"
        },
        function (isConfirm) {
            if (isConfirm) {
                CrearDatos();
            } else {
                window.location.href = "/settings/abbreviations";
            }
        });
}

function GuardarModal() {
    swal({
            title: "Desea Actualizar Abreviatura",
            message: "",
            type: "success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "Actualizar",
            closeOnConfirm: true,
            showCancelButton: true,
            cancelButtonClass: "btn-warning",
            cancelButtonText: "Cancelar"
        },
        function (isConfirm) {
            if (isConfirm) {
                ActualizarDatos();
            } else {
                window.location.href = "/settings/abbreviations";
            }
        });
}

function CancelarModal() {
    swal({
            title: "Sin Modificaciones",
            message: "",
            type: "warning",
            confirmButtonClass: "btn-success",
            confirmButtonText: "OK",
            closeOnConfirm: true,
            showCancelButton: true,
            cancelButtonClass: "btn-warning",
            cancelButtonText: "Cerrar"
        },
        function (isConfirm) {
            if (isConfirm) {
                window.location.href = "/settings/abbreviations";
            }
        });
}

function CrearDatos() {
    var id = $.trim($("#idabre").val());
    var value = $.trim($("#abre").val());
    $.ajax({
        method: "POST",
        url: "/settings/abbreviations/crear/ajax",
        data: {"idabreviatura": id, "abreviatura": value}
    })
        .done(function (data) {
            swal({
                    title: "Abreviatura creada correctemente!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        location.reload();
                    }
                });
        })
        .fail(function (err) {
            swal("Error creando la abreviatura", "error");
        });
}

function ActualizarDatos() {
    var id = $.trim($("#idabre").val());
    var value = $.trim($("#abre").val());
    $.ajax({
        method: "POST",
        url: "/settings/abbreviations/actualizar/ajax",
        data: {"idabreviatura": id, "abreviatura": value}
    })
        .done(function (data) {
            swal({
                    title: "Abreviatura actualizada correctemente!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        location.reload();
                    }
                });
        })
        .fail(function (err) {
            swal("Error actualizando la abreviatura", "error");
        });
}



