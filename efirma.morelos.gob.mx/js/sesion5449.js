/* 
 * Inicio de sesion y Cierre de sesion.
 * @document Sesion JS
 * @author daniel.alvarez, kenia.quezada
 * @version 21 Ago.2020
 */

/* global Swal */

/* *----------------------------------------------------------- FUNCIONES EXTRA Genericas----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */
/* 
 * Visualizar contraseña LOGIN
 * @author: kenia.quezada
 * @version 07 Sep. 2020
 */

function viewPass(opc) {
    if (opc == 1) {
        $("#password").attr("type", "text");
        $("#eyeS").css('display', 'none');
        $("#eyeH").css('display', 'block');

    } else if (opc == 2) {
        $("#password").attr("type", "password");
        $("#eyeH").css('display', 'none');
        $("#eyeS").css('display', 'block');
    }
}

/* 
 * Visualizar contraseña en Restablecer
 * @author: erick.morales
 * @version 17 Ene. 2024
 */

function viewPassR(opc) {
    if (opc == 1) {
        $("#password").attr("type", "text");
        $("#passwordR").attr("type", "text");
        $("#eyeSR").css('display', 'none');
        $("#eyeHR").css('display', 'block');

    } else if (opc == 2) {
        $("#password").attr("type", "password");
        $("#passwordR").attr("type", "password");
        $("#eyeHR").css('display', 'none');
        $("#eyeSR").css('display', 'block');
    }
}

/* 
 * Cambio de contraseña - Visualizar contraseñas
 * @author: kenia.quezada
 * @version 07 Sep. 2020
 */

function changePassView(opc) {
    if (opc == 1) {
        $("#campo_pass").attr("type", "text");
        $("#campo_passConfir").attr("type", "text");
        $("#eyePassS").css('display', 'none');
        $("#eyePassH").css('display', 'block');

    } else if (opc == 2) {
        $("#campo_pass").attr("type", "password");
        $("#campo_passConfir").attr("type", "password");
        $("#eyePassH").css('display', 'none');
        $("#eyePassS").css('display', 'block');
    }
}

function changePassViewReg(opc) {
    if (opc == 1) {
        $("#campo_passReg").attr("type", "text");
        $("#campo_passConfirReg").attr("type", "text");
        $("#eyePassSReg").css('display', 'none');
        $("#eyePassHReg").css('display', 'block');

    } else if (opc == 2) {
        $("#campo_passReg").attr("type", "password");
        $("#campo_passConfirReg").attr("type", "password");
        $("#eyePassHReg").css('display', 'none');
        $("#eyePassSReg").css('display', 'block');
    }
}

/*
 * Despues de Inicio de sesion ejecuta..
 * @version 22 Oct. 2020
 */
$(document).ready(function () {
    if(!usuarioPrimerIngreso()){
        usuarioExpirado();
    }
});

/* *----------------------------------------------------------- FUNCIONES Login/Logout----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

$('#login').on('submit', function (event) {
    event.preventDefault();
    if ($('input[name="username"]').val() !== '' && $('input[name="password"]').val() !== '') {
        $.ajax({
            type: "POST",
            url: "inicio",
            data: {
                accion: "login",
                username: $('input[name="username"]').val(),
                password: $('input[name="password"]').val()
            },
            beforeSend: function () {
                $('#btnLogin').html('<i class="fas fa-spinner fa-pulse fa-w-16 fa-lg"></i>&nbsp;Iniciando sesión ...');
                $('#btnLogin').prop("disabled", true);
            }
        })
                .done(function (response) {
                    if (response.success) {
                        localStorage.setItem('globalLimiteMinimoArchivo', response.limiteMinimo);
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '¡Bienvenido!',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            showConfirmButton: false,
                            timer: 1500
                        }).then((result) => {
                            /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {
                                location.href = response.url;
                            }
                        });
                    } else {
                        //$('#formLogin')[0].reset();
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            onOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer);
                                toast.addEventListener('mouseleave', Swal.resumeTimer);
                            }
                        });
                        Toast.fire({
                            icon: 'error',
                            title: 'Usuario y/o contraseña incorrectos'
                        });
                    }
                })
                .fail(function () {

                })
                .always(function () {
                    $('#btnLogin').html("Acceder");
                    $('#btnLogin').prop("disabled", false);
                });
    } else {
        Swal.fire({
            title: '¡Atención!',
            html: "El campo nombre de usuario y contraseña son requeridos",
            type: 'info',
            confirmButtonText: "Aceptar",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });
    }
});

/* cerrar sesion 
 * @version 24 Ago. 2020*/
$(document).on("click", "#btnLogout", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: "inicio",
        data: {
            accion: "logout"
        }
    }).done(function (response) {
        if (response.success) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Sesión cerrada!',
                html: 'Vuelva pronto',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false,
                timer: 1500
            }).then((result) => {
                localStorage.clear();
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    location.href = response.url;
                }
            });
        }
    }).fail(function () {
        Swal.fire({
            icon: 'info',
            title: 'No se pudo cerrar sesión',
            html: 'Ocurrió un incidente, favor de contactar al administrador',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#6E7959 '
        });
    }).always(function (response) {
        if (!response.success) {
            redirectToLogin(response);
        }
    });
});


/* cerrar sesion 
 * @version 24 Ago. 2020*/
function cerrarSesion() {
    $.ajax({
        type: "POST",
        url: "inicio",
        data: {
            accion: "logout"
        }
    }).always(function () {

    }).done(function (response) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Sesión cerrada!',
            html: 'Vuelva pronto',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            timer: 1500
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                location.href = response.url;
            }
        });

    }).fail(function () {
        Swal.fire({
            icon: 'info',
            title: 'No se pudo cerrar sesión',
            html: 'Ocurrió un incidente, favor de contactar al administrador',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#6E7959 '
        });
    });
}


/* *----------------------------------------------------------- FUNCIONES Cambio de contraseña ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

$(document).on("click", "#cambiarContra", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: "documento",
        data: {
            accion: "validaSesion"
        }
    }).done(function (response) {
        if (response.sesionExpirada) {
            redirectToLogin(response);
        } else {
            $('#modal_cambiarContraUsuario').modal('show');
        }
    }).fail(function (response) {
        response.sesionExpirada = true;
        redirectToLogin(response);
    }).always(function (response) {
        redirectToLogin(response);
    });

});

function validaNewContraUsuario(pass) {
    var bandera = false;
    let regex = new RegExp(`^(?!.*${$("#username").val()})(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&.*,_-])([A-Za-z\\d$@$#!%*?&.,_-]|[^ ]){8,50}$`);
    if ((regex).test(pass)) {
        bandera = true; //contiene caracteres solicitados
    } else {
        bandera = false; //no contiene caracteres
    }
    return bandera;
}

$("#modal_cambiarContraUsuario").on('show.bs.modal', function () {
    $('#campo_pass').keyup(validaContra);
    $('#campo_pass').keyup(confirmarContra);
    $('#campo_passConfir').keyup(confirmarContra);
});

$("#modal_cambiarContraUsuario").on('hide.bs.modal', function () {
    $('#form_cambiarContraUsuario')[0].reset();
    $('#campo_passConfir').removeClass('is-valid').removeClass('is-invalid');
    $('#campo_pass').removeClass('is-valid').removeClass('is-invalid'); //no contiene caracteres
});

/**
 * Valida contraseña
 *  @author: kenia.quezada
 *  @version: 29 Sep.2020
 */
function validaContra() {
    var expReg = new RegExp(`^(?!.*${$("#username").val()})(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&.*,_-])([A-Za-z\\d$@$#!%*?&.,_-]|[^ ]){8,50}$`);
    if ((expReg).test($('#campo_pass').val())) {
        $('#campo_pass').removeClass('is-invalid').addClass('is-valid'); //contiene caracteres solicitados
    } else {
        $('#campo_pass').removeClass('is-valid').addClass('is-invalid'); //no contiene caracteres
    }
}

/**
 * Valida contraseña al registrarse en SIGU
 *  @author: kenia.quezada
 *  @version: 29 Sep.2020
 */
function validaContraReg() {
    var expReg = new RegExp(`^(?!.*${$("#username").val()})(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&.*,_-])([A-Za-z\\d$@$#!%*?&.,_-]|[^ ]){8,50}$`);
    if ((expReg).test($('#campo_passReg').val())) {
        $('#campo_passReg').removeClass('is-invalid').addClass('is-valid'); //contiene caracteres solicitados
    } else {
        $('#campo_passReg').removeClass('is-valid').addClass('is-invalid'); //no contiene caracteres
    }
}

/**
 * Confirma contraseña
 *  @author: kenia.quezada
 *  @version: 18 Sep.2020
 */
function confirmarContra() {
    if ($('#campo_passConfir').val() === $('#campo_pass').val() && $('#campo_passConfir').val() !== '' && !$("#campo_pass").hasClass("is-invalid")) {
        $('#campo_passConfir').removeClass('is-invalid').addClass('is-valid');
    } else {
        $('#campo_passConfir').removeClass('is-valid').addClass('is-invalid');
    }
}

/**
 * Confirma contraseña al registrar SIGU
 *  @author: kenia.quezada
 *  @version: 30 Oct.2024
 */
function confirmarContraReg() {
    if ($('#campo_passConfirReg').val() === $('#campo_passReg').val() && $('#campo_passConfirReg').val() !== '' && !$("#campo_passReg").hasClass("is-invalid")) {
        $('#campo_passConfirReg').removeClass('is-invalid').addClass('is-valid');
    } else {
        $('#campo_passConfirReg').removeClass('is-valid').addClass('is-invalid');
    }
}

function confirmarRFCReg() {
    if ($('#campo_rfcConReg').val() === $('#campo_rfcReg').val() && $('#campo_rfcConReg').val() !== '' && !$("#campo_rfcReg").hasClass("is-invalid")) {
        $('#campo_rfcConReg').removeClass('is-invalid').addClass('is-valid');
    } else {
        $('#campo_rfcConReg').removeClass('is-valid').addClass('is-invalid');
    }
}

/* cambiar contraseña
 * @author: kenia.quezada
 * @version 07 Sep. 2020*/
$(document).on("submit", "form#form_cambiarContraUsuario", function (event) {
    event.preventDefault();
    var formData = new FormData($(this)[0]);
    let valiCaracEsp = false;
    valiCaracEsp = validaCaracteresEspecialesFormData(formData);
    if (!valiCaracEsp) {
        if ($("#campo_pass").val() === $("#campo_passConfir").val()) {
            if (validaNewContraUsuario($("#campo_pass").val()) && ($("#campo_pass") !== '' && !$("#campo_pass").hasClass("is-invalid") && !$("#campo_passConfir").hasClass("is-invalid"))) {
                $.ajax({
                    type: "POST",
                    url: "inicio",
                    data: {
                        accion: "cambiarContraUsuario",
                        campo_pass: $("#campo_pass").val()
                    },
                    dataType: 'json',
                    beforeSend: function () {
                        cargando('Cambiando contraseña...');
                        $('button[form="form_cambiarContraUsuario"]').prop('disabled', true);
                        $('button[data-dismiss="modal"]').prop('disabled', true);
                    }
                }).always(function () {
                    $('button[form="form_cambiarContraUsuario"]').prop('disabled', false);
                    $('button[data-dismiss="modal"]').prop('disabled', false);
                }).done(function (response) {
                    if (response.success) {
                        Swal.fire({
                            title: 'Se ha cambiado la contraseña',
                            text: "Vuelva a iniciar sesión",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#6E7959 ',
                            timer: 4000,
                            timerProgressBar: true,
                            imageUrl: './img/cargando.gif',
                            imageWidth: 150,
                            imageHeight: 130,
                            imageAlt: 'Cargando',
                            onBeforeOpen: () => {
                                $('#form_cambiarContraUsuario')[0].reset();
                                $('button[form="form_cambiarContraUsuario"]').prop('disabled', false);
                                $('button[data-dismiss="modal"]').prop('disabled', false);
                                $('#modal_cambiarContraUsuario').modal('hide');
                            }
                        }).then((result) => {
                            cerrarSesion();
                        });
                    } else {
                        muestraErrorAjax(response.mensaje);
                    }
                }).fail(function () {
                    Swal.fire({
                        icon: 'info',
                        title: 'No se pudo cambiar la contraseña',
                        html: 'Ocurrió un incidente, favor de contactar al administrador',
                        showCloseButton: false,
                        showCancelButton: false,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#6E7959 '
                    });
                });
            } else {
                Swal.fire({
                    title: '¡Atención!',
                    html: `La contraseña debe de contener por lo menos...
                        <ul align="left">
                            <li>Minimo 8 caracteres</li>
                            <li>Al menos una letra mayúscula</li>
                            <li>Al menos una letra minucula</li>
                            <li>Al menos un dígito</li>
                            <li>No espacios en blanco</li>
                            <li>Al menos 1 caracter especial [<strong>$@$!#%*?&.,_-</strong>] </li>
                            <li>Y ser diferente al nombre de usuario</li>
                        </ul>`,
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#6E7959 '
                });
            }
        } else {
            Swal.fire({
                title: 'Las contraseñas no coinciden',
                html: 'No se puede cambiar la contraseña si esta no se confirma correctamente',
                icon: 'warning',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#6E7959 '
            });
        }
    }
});

/** Muestra mensaje de sesion caducada
 * @author kenia.quezada
 * @version 09 Sep. 2020*/
function msjSesionCaducada(url) {
    Swal.fire({
        title: 'La sesión ha caducado',
        text: "Vuelva a iniciar sesión",
        //icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6E7959 ',
        timer: 4000,
        timerProgressBar: true,
        imageUrl: './img/cargando.gif',
        imageWidth: 150,
        imageHeight: 130,
        imageAlt: 'Cargando',
        onBeforeOpen: () => {
            //Swal.showLoading();
        }
    }).then((result) => {
        location.href = url;
    });
}

/**/
function usuarioExpirado() {
    let exp = $("#expirado").val();
    if (exp === "true") {
        // Se limpia formulario
        $('#form_cambiarContraUsuario')[0].reset();
        $('button[form="form_cambiarContraUsuario"]').prop('disabled', false);
        $('button[data-dismiss="modal"]').prop('disabled', true);
        $('#modal_cambiarContraUsuario').modal('show');
    }
}

function usuarioPrimerIngreso() {
    var primerIn =false;
    let primerIngreso = $("#primerIngreso").val();
    if (primerIngreso === "true") {
        // Se limpia formulario
        //$('#form_modificarUsuario')[0].reset();
        //$('button[form="form_cambiarContraUsuario"]').prop('disabled', false);
        //$('button[data-dismiss="modal"]').prop('disabled', false);

        // Agregar evento keydown para detectar cuando se presiona una tecla
        document.getElementById('campo_curpReg').addEventListener('keydown', function (event) {
            // Verificar si se ha presionado la tecla "Backspace" o "Delete"
            if (event.key === 'Backspace' || event.key === 'Delete') {
                // Eliminar el contenido del input
                document.getElementById("campo_nombreReg").value = '';
                document.getElementById("campo_apPaternoReg").value = '';
                document.getElementById("campo_apMaternoReg").value = '';
            }
        });
        primerIn=true;
        $('#modal_modUsuario').modal('show');
    }
    
    return primerIn;
}

function redirectToLogin(response) {
    if (response.sesionExpirada) {
        Swal.fire({
            title: 'Tiempo de sesión agotado',
            text: "Por favor, vuelva a iniciar sesión",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            imageUrl: './img/cargando.gif',
            imageWidth: '50%',
            imageHeight: '50%',
            imageAlt: 'Saliendo ...'
        }).then((result) => {
            window.location.reload();
        });
    }
}

$(document).on("click", "#cambiarCorreo", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: "documento",
        data: {
            accion: "validaSesion"
        }
    }).done(function (response) {
        if (response.sesionExpirada) {
            redirectToLogin(response);
        } else {
            $('#form_cambiarCorreo')[0].reset();
            $('#correoActual').val($('#tieneCorreo').val());
            $('#modal_cambioCorreo').modal('show');
        }
    }).fail(function (response) {
        response.sesionExpirada = true;
        redirectToLogin(response);
    }).always(function (response) {
        redirectToLogin(response);
    });

});

$('#form_cambiarCorreo').on('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(this);
    formData.append('accion', 'actualizaCorreo');
    var avanza = true;
    if ($("#correoActual").val() === '' || $("#correoActual").val() === null) {
        avanza = false;
        Swal.fire({
            icon: 'info',
            title: 'El correo electrónico actual es requerido',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#6E7959 '
        });
    }
    if ($("#correoNuevo").val() === '' || $("#correoNuevo").val() === null) {
        avanza = false;
        Swal.fire({
            icon: 'info',
            title: 'El nuevo correo electrónico es requerido',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#6E7959 '
        });
    }
    if ($("#correoNuevoC").val() === '' || $("#correoNuevoC").val() === null) {
        avanza = false;
        Swal.fire({
            icon: 'info',
            title: 'El correo electrónico de confirmación es requerido',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#6E7959 '
        });
    }
    if (avanza) {
        if ($("#correoActual").val() !== $("#correoNuevo").val()) {
            if ($("#correoNuevo").val() === $("#correoNuevoC").val()) {
                if (!$("#correoNuevo").hasClass("is-invalid") && !$("#correoNuevoC").hasClass("is-invalid")) {
                    $.ajax({
                        type: "POST",
                        dataType: 'json',
                        url: "usuario",
                        data: formData,
                        //async: false,
                        //cache: false,
                        processData: false, // tell jQuery not to process the data
                        contentType: false,
                        beforeSend: function () {
                            $('#btnCambiaCorreo').html('<i class="fas fa-spinner fa-w-16 fa-spin fa-lg"></i>&nbsp; Actualizando ...');
                            $('#btnCambiaCorreo').prop('disabled', true);
                            $('#btnCancelaCambiaCorreo').prop('disabled', true);
                        }
                    }).done(function (response) {
                        if (response.success) {
                            $('#tieneCorreo').val($("#correoNuevo").val());
                            $('#form_cambiarCorreo')[0].reset();
                            $('#modal_cambioCorreo').modal('hide');
                            Swal.fire({
                                icon: 'success',
                                title: '¡Éxito!',
                                title: 'Correo actualizado correctamente',
                                position: 'center',
                                showConfirmButton: false,
                                timer: 2000
                            });
                        } else {
                            muestraErroresAjax(response.mensaje);
                        }
                    }).fail(function () {
                        muestraError();
                    }).always(function () {
                        $('#btnCambiaCorreo').html("Actualizar");
                        $('#btnCambiaCorreo').prop('disabled', false);
                        $('#btnCancelaCambiaCorreo').prop('disabled', false);
                    });
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'El correo electrónico no es válido',
                        showCloseButton: false,
                        showCancelButton: false,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#6E7959 '
                    });
                }
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'El nuevo correo electrónico y el de confirmación, no son iguales',
                    showCloseButton: false,
                    showCancelButton: false,
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#6E7959 '
                });
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: 'El nuevo correo electrónico es el mismo que el actual',
                showCloseButton: false,
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#6E7959 '
            });
        }
    }
});


function confirmarCorreo() {
    if ($('#correoNuevoC').val() === $('#correoNuevo').val() && $('#correoNuevoC').val() !== '' && !$("#correoNuevo").hasClass("is-invalid")) {
        $('#correoNuevoC').removeClass('is-invalid').addClass('is-valid');
    } else {
        $('#correoNuevoC').removeClass('is-valid').addClass('is-invalid');
    }
}

function confirmarCorreoReg() {
    if ($('#campo_correoConReg').val() === $('#campo_correoReg').val() && $('#campo_correoConReg').val() !== '' && !$("#campo_correoReg").hasClass("is-invalid")) {
        $('#campo_correoConReg').removeClass('is-invalid').addClass('is-valid');
    } else {
        $('#campo_correoConReg').removeClass('is-valid').addClass('is-invalid');
    }
}

$("#modal_cambioCorreo").on('show.bs.modal', function () {
    $('#correoNuevo').keyup(validaCorreo);
    $('#correoNuevo').keyup(confirmarCorreo);
    $('#correoNuevoC').keyup(confirmarCorreo);
});


$("#modal_modUsuario").on('show.bs.modal', function () {
    $('#campo_correoReg').keyup(validaCorreoReg);
    $('#campo_correoReg').keyup(confirmarCorreoReg);
    $('#campo_correoConReg').keyup(confirmarCorreoReg);

    $('#campo_passReg').keyup(validaContraReg);
    $('#campo_passReg').keyup(confirmarContraReg);
    $('#campo_passConfirReg').keyup(confirmarContraReg);

    $('#campo_rfcConReg').keyup(confirmarRFCReg);
});

function validaCorreo() {
    var expReg = new RegExp(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$`);
    if ((expReg).test($('#correoNuevo').val())) {
        $('#correoNuevo').removeClass('is-invalid').addClass('is-valid'); //contiene caracteres solicitados
    } else {
        $('#correoNuevo').removeClass('is-valid').addClass('is-invalid'); //no contiene caracteres
    }
}
function validaCorreoReg() {
    var expReg = new RegExp(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$`);
    if ((expReg).test($('#campo_correoReg').val())) {
        $('#campo_correoReg').removeClass('is-invalid').addClass('is-valid'); //contiene caracteres solicitados
    } else {
        $('#campo_correoReg').removeClass('is-valid').addClass('is-invalid'); //no contiene caracteres
    }
}


$('#correoNuevo').on("cut copy paste", function (e) {
    e.preventDefault();
});
$('#correoNuevoC').on("cut copy paste", function (e) {
    e.preventDefault();
});


$('#modal_cambioCorreo').on('shown.bs.modal', function () {
    $(document).off('focusin.modal');
    $('#correoActual').focus();
});

$(document).on("click", "#papelera", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: "documento",
        data: {
            accion: "papelera"
        }
    }).done(function (response) {
        if (!response.inicio) {
            $('#contenido').html(response);
            $("html, body").animate({
                scrollTop: 00
            }, 500);
        } else {
            response.sesionExpirada = true;
            redirectToLogin(response);
        }
    }).fail(function () {
        Swal.fire({
            icon: 'info',
            title: 'No se pudo ir a la página',
            html: 'Ocurrió un incidente, favor de contactar al administrador',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#6E7959 '
        });
    }).always(function (response) {
        redirectToLogin(response);
    });
});

$(document).on("click", "#archivar", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: "documento",
        data: {
            accion: "archivar"
        }
    }).done(function (response) {
        if (!response.inicio) {
            $('#contenido').html(response);
            $("html, body").animate({
                scrollTop: 00
            }, 500);
        } else {
            response.sesionExpirada = true;
            redirectToLogin(response);
        }
    }).fail(function () {
        Swal.fire({
            icon: 'info',
            title: 'No se pudo ir a la página',
            html: 'Ocurrió un incidente, favor de contactar al administrador',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#6E7959 '
        });
    }).always(function (response) {
        redirectToLogin(response);
    });
});


var requiereUsuarioRec = false;
$('#recuperacion').on('submit', function (event) {
    event.preventDefault();
    var correoRec = $('input[name="correoRec"]').val();
    var usuarioRec = $('input[name="usuarioRec"]').val();
    if (correoRec !== '' && requiereUsuarioRec ? usuarioRec !== '' : true) {
        $.ajax({
            type: "POST",
            url: "recuperacion",
            data: {
                accion: "enviarRecuperacion",
                correo: correoRec,
                usuario: usuarioRec
            },
            beforeSend: function () {
                $('#btnRecuperacion').html('<i class="fas fa-spinner fa-pulse fa-w-16 fa-lg"></i>&nbsp;Enviando recuperación ...');
                $('#btnRecuperacion').prop("disabled", true);
            }
        }).done(function (response) {
            //console.log(response);
            if (response.success) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '',
                    text: 'Si los datos proporcionados son correctos, recibirá un correo electrónico para reestablecer su contraseña. De lo contrario favor de contactar al administrador del sistema.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false,
                    timer: 10000,
                    timerProgressBar: true
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        location.href = response.url;
                    }
                });
            } else {
                if (response.requiereUsuarioRec) {


                    if (!requiereUsuarioRec) {
                        requiereUsuarioRec = true;
                        $("#nombreUsuarioRecContainer").fadeIn();
                        $("#nombreUsuarioRecContainer").find("input[name='usuarioRec']").attr("required", "");
                    } else {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            onOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer);
                                toast.addEventListener('mouseleave', Swal.resumeTimer);
                            }
                        });
                        Toast.fire({
                            icon: 'error',
                            title: 'Error al consultar la información. Favor de contactar al administrador del sistema.'
                        });
                    }

                } else {
                    //$('#formLogin')[0].reset();
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        onOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });
                    Toast.fire({
                        icon: 'error',
                        title: 'Error al realizar la operación. Favor de contactar al administrador del sistema.'
                    });
                }
            }
        })
                .fail(function () {

                })
                .always(function () {
                    $('#btnRecuperacion').html("Continuar");
                    $('#btnRecuperacion').prop("disabled", false);
                });
    } else {
        Swal.fire({
            title: '¡Atención!',
            html: "Todos los campos son requeridos",
            type: 'info',
            confirmButtonText: "Aceptar",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });
    }
});

$('#restablecer').on('submit', function (event) {
    event.preventDefault();
    var token = $('input[name="token"]').val();
    var contrasena = $('input[name="contrasena"]').val();
    var contrasenaConfirmacion = $('input[name="contrasenaConfirmacion"]').val();
    if (token !== '' && contrasena !== '' && contrasenaConfirmacion !== '') {

        if (contrasena == contrasenaConfirmacion) {
            $.ajax({
                type: "POST",
                url: "recuperacion",
                data: {
                    accion: "restablecerContrasena",
                    token: token.trim(),
                    campo_pass: contrasena.trim(),
                    campo_pass_confirmacion: contrasenaConfirmacion.trim()
                },
                beforeSend: function () {
                    $('#btnRecuperacion').html('<i class="fas fa-spinner fa-pulse fa-w-16 fa-lg"></i>&nbsp;Restableciendo ...');
                    $('#btnRecuperacion').prop("disabled", true);
                }
            }).done(function (response) {
                if (response.success) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '',
                        text: 'Su contraseña ha sido restablecida. Ahora puede iniciar sesión.',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true
                    }).then((result) => {
                        /* Read more about handling dismissals below */
                        if (result.dismiss === Swal.DismissReason.timer) {
                            location.href = response.url;
                        }
                    });
                } else {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        onOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });
                    Toast.fire({
                        icon: 'error',
                        title: response.error
                    });
                }
            })
                    .fail(function () {

                    })
                    .always(function () {
                        $('#btnRecuperacion').html("Continuar");
                        $('#btnRecuperacion').prop("disabled", false);
                    });
        } else {
            Swal.fire({
                title: '¡Atención!',
                html: "Las contraseñas ingresadas no coinciden",
                type: 'info',
                confirmButtonText: "Aceptar",
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        }
    } else {
        Swal.fire({
            title: '¡Atención!',
            html: "Todos los campos son requeridos",
            type: 'info',
            confirmButtonText: "Aceptar",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });
    }
});

$('#confNotif').on('click', function () {
    let idEst = document.getElementById("iduserEst").value;
    let idUser = document.getElementById("iduser").value;
    let correo = document.getElementById("tieneCorreo").value;
    $.ajax({
        type: 'POST',
        url: 'usuario',
        data: {
            accion: 'verifyNotificacion',
            idEst: idEst,
            idUser: idUser,
            correo: correo
        }
    }).done(function (response) {
        if (response.success) {
            if (response.notificacion === 1) {
                document.getElementById("emailNoti").checked = true;
                $('#txt_emailNoti').html('Notificaciones por correo electrónico: ACTIVADAS')
            } else if (response.notificacion === 0) {
                document.getElementById("emailNoti").checked = false;
                $('#txt_emailNoti').html('Notificaciones por correo electrónico: DESACTIVADAS')
            }
            $('#modalNotificaciones').modal('show');
        }
    }).fail(function () {
    }).always(function () {
        $('#modalNotificaciones').modal('show');
    });
});

$('#form_gNotificacion').on('click', function () {
    let notif = 0;
    if (document.getElementById("emailNoti").checked)
        notif = 1;
    else if (!document.getElementById("emailNoti").checked)
        notif = 0;

    let idEst = document.getElementById("iduserEst").value;
    let idUser = document.getElementById("iduser").value;
    let correo = document.getElementById("tieneCorreo").value;
    $.ajax({
        type: 'POST',
        url: 'usuario',
        data: {
            accion: 'updateNotificacion',
            notificacion: notif,
            idEst: idEst,
            idUser: idUser,
            correo: correo
        }
    }).done(function (response) {
        if (response.success) {
            Swal.fire({
                title: '¡Éxito!',
                html: "Configuración de notificaciones guardada correctamente",
                icon: 'success',
                position: 'center',
                showConfirmButton: false,
                timer: 2000
            });
            $('#modalNotificaciones').modal('hide');
        } else
            muestraError();

    }).fail(function () {
        muestraError();
    }).always(function () {
        $('#modalNotificaciones').modal('hide');
    });
});

/* consultar curp
 */
$(document).on("click", "#btnBuscarCurp", function (event) {
    var curp = $("#campo_curpReg").val().toUpperCase();
    var regex = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|BC|BS|CC|CL|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TL|TS|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d)$/;

    if (regex.test(curp)) {
        $.ajax({
            type: "POST",
            url: "inicio",
            data: {
                accion: "consultarCURP",
                curp: curp
            }
        }).done(function (response) {

            if (response.success && response.codigoError == "") {
                document.getElementById("campo_nombreReg").value = response.nombre;
                document.getElementById("campo_apPaternoReg").value = response.apellidoPaterno;
                document.getElementById("campo_apMaternoReg").value = response.apellidoMaterno;
            } else {
                muestraErrorAjax(response.mensaje);
            }

        }).fail(function () {
            Swal.fire({
                icon: 'info',
                title: 'No se pudo consultar información del CURP',
                html: 'Ocurrió un incidente, favor de contactar al administrador',
                showCloseButton: false,
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#6E7959 '
            });
        });
    } else {
        muestraErrorAjax('El campo CURP: No cumple con el formato especificado.');
    }
});


/*Registrar SIGU
 * @author : Everardo García
 * @version:   */
$('#form_modUsuario').on('submit', function (event) {
    event.preventDefault();
    if (validaCamposReq()) {
        if (validaNewContraUsuario($("#campo_passReg").val())) {
            $.ajax({
                url: 'inicio',
                type: 'POST',
                data: {accion: "registrarSIGU",
                    nombre: $("#campo_nombreReg").val(),
                    apPaterno: $("#campo_apPaternoReg").val(),
                    apMaterno: $("#campo_apMaternoReg").val(),
                    curp: $("#campo_curpReg").val(),
                    numEmpleado: $("#campo_numEmpleadoReg").val(),
                    rfc: $("#campo_rfcReg").val(),
                    correo: $("#campo_correoReg").val(),
                    numCelular: $("#campo_numCelularReg").val(),
                    contrasena: $("#campo_passReg").val()
                }
            }).done(function (data) {
                if (data.success) {
                    Swal.fire({
                        title: 'Ahora ya cuentas con tu llave Morelos',
                        text: data.mensaje,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#6E7959 ',
                        imageUrl: './img/cargando.gif',
                        imageWidth: 150,
                        imageHeight: 130,
                        imageAlt: 'Cargando',
                        onBeforeOpen: () => {
                            $('#form_modUsuario')[0].reset();
                        }
                    }).then((result) => {
                        cerrarSesion();
                    });
                } else {
                    muestraErrorAjax(data.mensaje);
                }
            }).fail(function () {
                muestraError();
            });
        } else {
            Swal.fire({
                title: '¡Atención!',
                html: `La contraseña debe de contener por lo menos...
                        <ul align="left">
                            <li>Minimo 8 caracteres</li>
                            <li>Al menos una letra mayúscula</li>
                            <li>Al menos una letra minucula</li>
                            <li>Al menos un dígito</li>
                            <li>No espacios en blanco</li>
                            <li>Al menos 1 caracter especial [<strong>$@$!#%*?&.,_-</strong>] </li>
                            <li>Y ser diferente al nombre de usuario</li>
                        </ul>`,
                icon: 'warning',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#6E7959 '
            });
        }
    }
});

function validaCamposReq() {
    let errorMostrar = [];//msjs de error

    if ($("#campo_curpReg").val() === '') {
        errorMostrar.push('Introduzca CURP');
    }

    if ($("#campo_nombreReg").val() === '' || $("#campo_apPaternoReg").val() === '' || $("#campo_apMaternoReg").val() === '') {
        errorMostrar.push('Introduzca CURP y dar clic en buscar para mostrar los datos de nombre, apellido paterno y apellido materno');
    }
//    if ($("#campo_numEmpleado").val() === '') {
//        errorMostrar.push('Introduzca Número de empleado');
//    }
    if ($("#campo_rfcReg").val() === '') {
        errorMostrar.push('Introduzca RFC');
    } else {
        var regex = /^([A-ZÑ&]{3,4})\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z0-9]{3}$/;
        var rfc = document.getElementById("campo_rfcReg").value.toUpperCase();
        if (!regex.test(rfc)) {
            errorMostrar.push('Introduzca RFC valido con homoclave');
        }
    }
    if ($("#campo_correo").val() === '') {
        errorMostrar.push('Introduzca correo electrónico');
    }
//    if ($("#campo_numCelular").val() === '') {
//        errorMostrar.push('Introduzca Número de celular');
//    }

    if ($("#campo_passReg").val() === '' || $("#campo_passConfirReg").val() === '') {
        errorMostrar.push('Introduzca contraseña y confirme contraseña');
    }
    
    if ($("#campo_correoReg").val() !== $("#campo_correoConReg").val()) {
        errorMostrar.push('Confirmar correo electrónico correctamente');
    }
    
    if ($("#campo_passReg").val() !== $("#campo_passConfirReg").val()) {
        errorMostrar.push('Confirmar contraseña correctamente');
    }

    if ($("#campo_rfcReg").val() !== $("#campo_rfcConReg").val()) {
        errorMostrar.push('Confirmar RFC correctamente');
    }


    if (errorMostrar.length > 0) { //Existe errores?
        muestraErroresAjax(errorMostrar);
        return false;//Sin avanzar
    } else {
        return true;
    }
}
