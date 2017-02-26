// Llamados al endpoint de carga de datos iniciales+
function CargarDatos() {
    $.ajax({
        method: "GET",
        url: "/parametros/municipios/ajax"
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
                        '<a href="/parametros/municipios/editar/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle btn-sm purple">' +
                        '<i class="fa fa-edit"></i> Editar </a>' +
                        '<a href="/parametros/municipios/eliminar/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle dark btn-sm black">' +
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
            title:"Crear un nuevo Municipio",
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
                window.location.href = "/parametros/municipios";
            }
        });
}

function GuardarModal() {
    swal({
            title:"Actualizar Municipio...",
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
                window.location.href = "/parametros/municipios";
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
                window.location.href = "/parametros/municipios";
            }
        });
}

function CrearDatos() {
    var id = $.trim($("#idmuni").val());
    var value = $.trim($("#iddepart").val());
    var vmunicipio = $.trim($("#muni").val());
    $.ajax({
        method: "POST",
        url: "/parametros/municipios/crear/ajax",
        data : {"idmunicipio" : id, "iddepartamento" : value, "municipio" :vmunicipio}
    })
        .done(function (data) {
            swal({
                    title:"Municipio creado correctemente!",
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
            swal("Error creando el municipio", "error");
        });
}

function ActualizarDatos() {
    var id = $.trim($("#idmuni").val());
    var value = $.trim($("#iddepart").val());
    var vmunicipio = $.trim($("#muni").val());
    $.ajax({
        method: "POST",
        url: "/parametros/municipios/actualizar/ajax",
        data : {"idmunicipio" : id, "iddepartamento" : value, "municipio" :vmunicipio}
    })
        .done(function (data) {
            swal({
                    title:"Municipio actualizado correctemente!",
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
            swal("Error actualizando el municipio", "error");
        });
}


