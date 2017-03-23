// Llamados al endpoint de carga de datos iniciales+
function CargarDatos() {
    $.ajax({
        method: "GET",
        url: "/settings/departamentos/ajax"
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
                        '<a href="/settings/departamentos/editar/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle btn-sm purple">' +
                        '<i class="fa fa-edit"></i> Editar </a>' +
                        '<a href="/settings/departamentos/eliminar/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle dark btn-sm black">' +
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

function NuevoModal() {
    swal({
            title:"Crear una nuevo departamento",
            message: "",
            type:"success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "Crear",
            closeOnConfirm: true,
            showCancelButton: true,
            cancelButtonClass: "btn-warning",
            cancelButtonText: "Cancelar"
        },
        function(isConfirm){
            if (isConfirm) {
                CrearDatos();
            }else{
                window.location.href = "/settings/departamentos";
            }
        });
}

function GuardarModal() {
    swal({
            title:"Actualizar Departamento...",
            message: "",
            type:"warning",
            confirmButtonClass: "btn-success",
            confirmButtonText: "Actualizar",
            closeOnConfirm: true,
            showCancelButton: true,
            cancelButtonClass: "btn-warning",
            cancelButtonText: "Cancelar"
        },
        function(isConfirm){
            if (isConfirm) {
                ActualizarDatos();
            }else{
                window.location.href = "/settings/departamentos";
            }
        });
}

function CancelarModal() {
    swal({
            title:"Sin Modificaciones",
            message: "",
            type:"warning",
            confirmButtonClass: "btn-success",
            confirmButtonText: "OK",
            closeOnConfirm: true,
            showCancelButton: true,
            cancelButtonClass: "btn-warning",
            cancelButtonText: "Cerrar"
        },
        function(isConfirm){
            if (isConfirm) {
                window.location.href = "/settings/departamentos";
            }
        });
}

function CrearDatos() {
    var id = $.trim($("#iddepar").val());
    var value = $.trim($("#depar").val());
    var vidpais = $.trim($("#idpais").val());
    $.ajax({
        method: "POST",
        url: "/settings/departamentos/crear/ajax",
        data : {"iddepartamento" : id, "departamento" : value, "idpais" :vidpais}
    })
        .done(function (data) {
            swal({
                    title:"Departamento creado correctemente!",
                    type:"success",
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
            swal("Error creando el departamento", "error");
        });
}

function ActualizarDatos() {
    var id = $.trim($("#iddepar").val());
    var value = $.trim($("#depar").val());
    var vidpais = $.trim($("#idpais").val());
    $.ajax({
        method: "POST",
        url: "/settings/departamentos/actualizar/ajax",
        data : {"iddepartamento" : id, "departamento" : value, "idpais" :vidpais}
    })
        .done(function (data) {
            swal({
                    title:"Departamento actualizado correctemente!",
                    type:"success",
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
            swal("Error actualizando el departamanto", "error");
        });
}



