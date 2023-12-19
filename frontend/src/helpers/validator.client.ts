import { validarNumeros, validarSoloLetras } from '../utils/common';


export const formValidations: { [key: string]: [(data: number | string | string[] | undefined | null) => boolean, string] } = {
  marca: [
    (data: number | string | string[] | undefined | null) => {
      return typeof data === 'string' ? data.length >= 3 && validarSoloLetras(data) : false;
    },
    'La marca no puede estar vacio -> min 3 caracteres',
  ],
  modelo: [
    (data: number | string | string[] | undefined | null) => {
      return typeof data === 'string' ? data.length >= 3 && data.length >= 2 : false;
    },
    'El modelo no puede estar vacio -> min 3 caracteres',
  ],
  disco_rigido_id: [
    (data: number | string | string[] | undefined | null) => {
      return typeof data === 'number' ? data >= 1 : false;
    },
    'Debe estar seleccionado un disco',
  ],
  memoria: [
    (data: number | string | string[] | undefined | null) => {
      return typeof data === 'string'
        ? data.length >= 3
        : false;
    },
    'debes ingresar ram',
  ],
  placa_video: [
    (data: number | string | string[] | undefined | null) => {
      return typeof data === 'string' ? data.length >= 3 || !data : false;
    },
    'telefono debe ser solo numeros y minimo 8 digitos',
  ],
  precio: [
    (data: number | string | string[] | undefined | null) => {
      return typeof data === 'string'  ? data.length >= 3 && validarNumeros(data,'.') : typeof data === 'number' ? data.toString().length >=3:
      false;
    },
    'precio debe ser solo numeros y minimo 3 digitos',
  ],
  // Agrega más validaciones de acuerdo a tus necesidades
};

export const formValidationsSearch: {
  [key: string]: [(data: number | string | string[] | undefined | null) => boolean, string];
} = {
  marca: [
    (data: number | string | string[] | undefined | null) => {
      return typeof data === 'string' ? data.length >= 3 || !data  : false;
    },
    'La marca no puede estar vacio -> min 3 caracteres',
  ],
  modelo: [
    (data: number | string | string[] | undefined | null) => {
      return typeof data === 'string' ? data.length >= 3 || !data  : false;
    },
    'El modelo no puede estar vacio -> min 3 caracteres',
  ],
  placa_video: [
    (data: number | string | string[] | undefined | null) => {
      return typeof data === 'string' ? data.length >= 3 || !data : false;
    },
    'telefono debe ser solo numeros y minimo 8 digitos',
  ],
};
