import { validarNumeros, validarSoloLetras } from '../utils/common';

export const formValidations: { [key: string]: [(data: string | number) => boolean, string] } = {
  marca: [
    (data: string | number) => {
      return typeof data === 'string' ? data.length >= 3 && validarSoloLetras(data) : false;
    },
    'La marca no puede estar vacio -> min 3 caracteres',
  ],
  modelo: [
    (data: string | number) => {
      return typeof data === 'string' ? data.length >= 3 && data.length >= 2 : false;
    },
    'El modelo no puede estar vacio -> min 3 caracteres',
  ],
  disco_rigido_id: [
    (data: string | number) => {
      return typeof data === 'number' ? data >= 1 : false;
    },
    'Debe estar seleccionado un disco',
  ],
  memoria: [
    (data: string | number) => {
      return typeof data === 'string'
        ? data.length >= 4
        : false;
    },
    'debes seleccionar un sexo',
  ],
  placa_video: [
    (data: string | number) => {
      return typeof data === 'string' ? data.length >= 3 || !data : false;
    },
    'telefono debe ser solo numeros y minimo 8 digitos',
  ],
  precio: [
    (data: string | number) => {
      return typeof data === 'string' ? data.length >= 3 && validarNumeros(data) : false;
    },
    'precio debe ser solo numeros y minimo 3 digitos',
  ],
  // Agrega más validaciones de acuerdo a tus necesidades
};

export const formValidationsSearch: {
  [key: string]: [(data: string | number) => boolean, string];
} = {
  marca: [
    (data: string | number) => {
      return typeof data === 'string' ? data.length >= 3 && validarSoloLetras(data) || !data  : false;
    },
    'La marca no puede estar vacio -> min 3 caracteres',
  ],
  modelo: [
    (data: string | number) => {
      return typeof data === 'string' ? data.length >= 3 || !data  : false;
    },
    'El modelo no puede estar vacio -> min 3 caracteres',
  ],
  placa_video: [
    (data: string | number) => {
      return typeof data === 'string' ? data.length >= 3 || !data : false;
    },
    'telefono debe ser solo numeros y minimo 8 digitos',
  ],
};
