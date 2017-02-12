// Llamados al endpoint de carga de datos iniciales+
$( document ).ready(function() {
    var amountRows = $('select[name=sample_1_length]').val();
    $.ajax({
        method: "GET",
        url: "/parametros/paises/ajax"
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
                        '<a href="/parametros/paises/editar/'+ data.rows[i][0].toLowerCase() + '" class="btn btn-outline btn-circle btn-sm purple">' +
                        '<i class="fa fa-edit"></i> Editar </a>' +
                        '<a href="/parametros/paises/eliminar/'+ data.rows[i][0].toLowerCase() + '" class="btn btn-outline btn-circle dark btn-sm black">' +
                        '<i class="fa fa-trash-o"></i> Eliminar </a>' +
                        '<a href="/parametros/paises/'+ data.rows[i][0].toLowerCase() + '" class="btn btn-outline btn-circle red btn-sm blue">' +
                        '<i class="fa fa-share"></i> Ver </a>' +
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
});

