// Llamados al endpoint de carga de datos iniciales+
function CargarDatos() {
    $.ajax({
        method: "GET",
        url: "/parametros/zonas/ajax"
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
                        '<a href="/parametros/zonas/editar/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle btn-sm purple">' +
                        '<i class="fa fa-edit"></i> Editar </a>' +
                        '<a href="/parametros/zonas/eliminar/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle dark btn-sm black">' +
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
            title:"Crear una nueva Zona",
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
                window.location.href = "/parametros/zonas";
            }
        });
}

function GuardarModal() {
    swal({
            title:"Zona Actualizada",
            message: "",
            type:"success",
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
                window.location.href = "/parametros/zonas";
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
                window.location.href = "/parametros/zonas";
            }
        });
}

function CrearDatos() {
    var id = $.trim($("#idzona").val());
    var value = $.trim($("#zona").val());
    $.ajax({
        method: "POST",
        url: "/parametros/zonas/crear/ajax",
        data : {"idzona" : id, "zona" : value}
    })
        .done(function (data) {
            swal({
                    title:"Zona creada correctemente!",
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
            swal("Error creando la zona", "error");
        });
}

function ActualizarDatos() {
    var id = $.trim($("#idzona").val());
    var value = $.trim($("#zona").val());
    $.ajax({
        method: "POST",
        url: "/parametros/zonas/actualizar/ajax",
        data : {"idzona" : id, "zona" : value}
    })
        .done(function (data) {
            swal({
                    title:"Zona actualizada correctemente!",
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
            swal("Error actualizando la zona", "error");
        });
}




