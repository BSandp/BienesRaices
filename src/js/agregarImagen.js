import {Dropzone} from 'dropzone';

const token = document.querySelector("meta[name='csrf-token']").getAttribute('content')

Dropzone.options.imagen={
    dictDefaultMessage:'Sube tus imágenes aquí',
    acceptedFiles:'.png,.jpg,.jpeg',
    maxFilesize:5,
    maxFiles:1,
    parallelUploads:1,
    autoProcessQueue:true,
    addRemoveLinks:true,
    dictRemoveFile:'Quitar archivo',
    dictMaxFilesExceeded: 'El maximo es 1 imagen',
    dictFileTooBig: 'El archivo debe pesar menos de 5 MB', // Mensaje para el peso máximo
    headers:{
        'CSRF-Token': token
    },
    paramName: 'imagen'
}
