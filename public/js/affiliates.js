// Llamados al endpoint de carga de datos iniciales+
function CargarDatos() {
    var amountRows = $('select[name=sample_1_length]').val();
    $.ajax({
        method: "GET",
        url: "/settings/afiliados/ajax"
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
                        '<td>' + data.rows[i][3] + '</td>' +
                        '<td>' + data.rows[i][4] + '</td>' +

                        '<td>' +
                        '<div style="text-align:center" >' +
                        '<a href="/settings/afiliados/editar/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle btn-sm purple">' +
                        '<i class="fa fa-edit"></i> Editar </a>' +
                        '<a href="/settings/afiliados/eliminar/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle dark btn-sm black">' +
                        '<i class="fa fa-trash-o"></i> Eliminar </a>' +
                        '<a href="/settings/afiliados/'+ data.rows[i][0].toString().toLowerCase() + '" class="btn btn-outline btn-circle red btn-sm blue">' +
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
}

function CargarReferidosPorAfiliad(idAfiliado) {
    if(idAfiliado !== 'undefined'){
        $.ajax({
            method: "GET",
            url: "/affiliates/referred/" + idAfiliado
        })
            .done(function (data) {
                var iterador = data;
                $('#txtbeneficiarios').text(data.length);
                if(data.length > 0){
                    var trHTML = '';
                    $.each(iterador, function (i, abreviData) {
                        trHTML += '<tr class="odd gradeX">' +
                            '<td>' + ((abreviData[22] === null) ?  '' : abreviData[22]) + '</td>' +
                            '<td>' + ((abreviData[23] === null) ?  '' : abreviData[23]) + '</td>' +
                            '<td>' + ((abreviData[24] === null) ?  '' : abreviData[24]) + '</td>' +
                            '<td>' + ((abreviData[25] === null) ?  '' : abreviData[25]) + '</td>' +
                            '<td>' + ((abreviData[26] === null) ?  '' : abreviData[27]) + '</td>' +
                            '<td>' +
                            '<div style="text-align:center" >' +
                            '<a href="/referred/'+ abreviData[21].toString().toLowerCase() + '?afiliado=' + idAfiliado + '" class="btn btn-outline btn-circle red btn-sm blue">' +
                            '<i class="fa fa-share"></i> Ver </a>' +
                            '</div>' +
                            '</td>' +
                            '</tr>';
                    });

                    $('#resultados').empty().append(trHTML);
                }else{
                    $('#resultados').empty();
                }

                if (App.isAngularJsApp() === false) {
                    TableDatatablesManaged.init();
                }
            });
    }
}

function CargarImagenAfiliado(idAfiliado) {
    if(idAfiliado !== 'undefined'){
        $.ajax({
            method: "GET",
            url: "/affiliates/images/ajax/" + idAfiliado
        })
            .done(function (data) {
                console.log(data.img);
                if(data[0] !== null){
                    console.log('diferente');
                    console.log(data.img);
                    $('#affiliateProfile').attr("src", data.img);
                }
            });
    }
}