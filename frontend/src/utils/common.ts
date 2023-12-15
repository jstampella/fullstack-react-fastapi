/* eslint-disable @typescript-eslint/no-explicit-any */
import queryString from 'query-string';
import { IClientFormSearch } from '../interfaces';

/**
 * Función que valida si una cadena contiene solo números
 * @param str  string para validar
 * @returns boolean
 */
export const validarNumeros = (str: string): boolean => {
  const numerosRegex = /^[0-9]+$/;
  return numerosRegex.test(str);
};

/**
 * Función que valida si una cadena es solo letras
 * @param cadena string para validar
 * @returns boolean
 */
export const validarSoloLetras = (cadena: string): boolean => {
  const regex = /^[a-zA-Zá-úÁ-ÚüÜñÑ]+$/;
  return regex.test(cadena);
};

/**
 * Funcion para convertir objeto en string url params
 * @param obj object para convertir a string url
 * @returns string &
 */
export const objectToUrlParams = (obj: Record<string, any>): string => {
  const params = Object.entries(obj)
    .filter(([_, value]: [string, any]) => value !== null && value !== undefined)
    .map(([key, value]: [string, any]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return params;
};

// Crear una función que convierta los datos a un tipo seguro sin valores nulos
export const convertirSearchCliente = (
  datos: queryString.ParsedQuery<string>
): IClientFormSearch => {
  return {
    dni: datos.dni !== null && datos.dni ? datos.dni.toString() : '',
    nombre: datos.nombre !== null && datos.nombre ? datos.nombre.toString() : '',
    apellido: datos.apellido !== null && datos.apellido ? datos.apellido.toString() : '',
    sexo: datos.sexo !== null && datos.sexo ? datos.sexo.toString() : '',
  };
};

/**
 * Compara dos objetos y devuelve true si todos sus atributos son iguales, false en caso contrario.
 * @param objeto1 El primer objeto a comparar.
 * @param objeto2 El segundo objeto a comparar.
 * @returns True si todos los atributos son iguales, false en caso contrario.
 */
export const compartirObjetos = <T>(objeto1: T, objeto2: T): boolean => {
  for (const propiedad in objeto1) {
    if (
      Object.prototype.hasOwnProperty.call(objeto1, propiedad) &&
      Object.prototype.hasOwnProperty.call(objeto2, propiedad) &&
      objeto1[propiedad] !== objeto2[propiedad]
    ) {
      return false;
    }
  }

  return true;
};

// hex to rgba converter
export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Removes any undefined or empty properties from an object
 * @param obj - The object to remove undefined and empty properties from
 * @returns The object without undefined and empty properties
 */
export const removeUndefinedAndEmptyProperties = <T>(obj: T): T => {
  const newObj = { ...obj };
  for (const key in newObj) {
    if (newObj[key] === undefined || newObj[key] === '') {
      delete newObj[key];
    } else if (typeof newObj[key] === 'object') {
      removeUndefinedAndEmptyProperties(newObj[key]);
    }
  }
  return newObj;
};
