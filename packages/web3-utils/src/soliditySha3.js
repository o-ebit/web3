/*
 This file is part of web3.js.

 web3.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 web3.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file soliditySha3.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import BN from 'https://jspm.dev/bn.js';

import utils from './utils.js';

const _elementaryName = function (name) {
  /* jshint maxcomplexity:false */

  if (name.startsWith('int[')) {
    return `int256${ name.slice(3)}`;
  } if (name === 'int') {
    return 'int256';
  } if (name.startsWith('uint[')) {
    return `uint256${ name.slice(4)}`;
  } if (name === 'uint') {
    return 'uint256';
  } if (name.startsWith('fixed[')) {
    return `fixed128x128${ name.slice(5)}`;
  } if (name === 'fixed') {
    return 'fixed128x128';
  } if (name.startsWith('ufixed[')) {
    return `ufixed128x128${ name.slice(6)}`;
  } if (name === 'ufixed') {
    return 'ufixed128x128';
  }
  return name;
};

// Parse N from type<N>
const _parseTypeN = function (type) {
  const typesize = /^\D+(\d+).*$/.exec(type);
  return typesize ? parseInt(typesize[1], 10) : null;
};

// Parse N from type[<N>]
const _parseTypeNArray = function (type) {
  const arraySize = /^\D+\d*\[(\d+)\]$/.exec(type);
  return arraySize ? parseInt(arraySize[1], 10) : null;
};

const _parseNumber = function (arg) {
  const type = typeof arg;
  if (type === 'string') {
    if (utils.isHexStrict(arg)) {
      return new BN(arg.replace(/0x/i, ''), 16);
    } 
    return new BN(arg, 10);
  } if (type === 'number') {
    return new BN(arg);
  } if (utils.isBigNumber(arg)) {
    return new BN(arg.toString(10));
  } if (utils.isBN(arg)) {
    return arg;
  } 
  throw new Error(`${arg} is not a number`);
};

const _solidityPack = function (type, value, arraySize) {
  /* jshint maxcomplexity:false */

  let size; let 
    num;
  type = _elementaryName(type);

  if (type === 'bytes') {
    if (value.replace(/^0x/i, '').length % 2 !== 0) {
      throw new Error(`Invalid bytes characters ${value.length}`);
    }

    return value;
  } if (type === 'string') {
    return utils.utf8ToHex(value);
  } if (type === 'bool') {
    return value ? '01' : '00';
  } if (type.startsWith('address')) {
    if (arraySize) {
      size = 64;
    } else {
      size = 40;
    }

    if (!utils.isAddress(value)) {
      throw new Error(`${value} is not a valid address, or the checksum is invalid.`);
    }

    return utils.leftPad(value.toLowerCase(), size);
  }

  size = _parseTypeN(type);

  if (type.startsWith('bytes')) {
    if (!size) {
      throw new Error('bytes[] not yet supported in solidity');
    }

    // must be 32 byte slices when in an array
    if (arraySize) {
      size = 32;
    }

    if (size < 1 || size > 32 || size < value.replace(/^0x/i, '').length / 2) {
      throw new Error(`Invalid bytes${ size} for ${value}`);
    }

    return utils.rightPad(value, size * 2);
  } if (type.startsWith('uint')) {
    if ((size % 8) || (size < 8) || (size > 256)) {
      throw new Error(`Invalid uint${size} size`);
    }

    num = _parseNumber(value);
    if (num.bitLength() > size) {
      throw new Error(`Supplied uint exceeds width: ${ size } vs ${ num.bitLength()}`);
    }

    if (num.lt(new BN(0))) {
      throw new Error(`Supplied uint ${num.toString()} is negative`);
    }

    return size ? utils.leftPad(num.toString('hex'), size / 8 * 2) : num;
  } if (type.startsWith('int')) {
    if ((size % 8) || (size < 8) || (size > 256)) {
      throw new Error(`Invalid int${size} size`);
    }

    num = _parseNumber(value);
    if (num.bitLength() > size) {
      throw new Error(`Supplied int exceeds width: ${ size } vs ${ num.bitLength()}`);
    }

    if (num.lt(new BN(0))) {
      return num.toTwos(size).toString('hex');
    } 
    return size ? utils.leftPad(num.toString('hex'), size / 8 * 2) : num;
  } 
  // FIXME: support all other types
  throw new Error(`Unsupported or invalid type: ${ type}`);
};

const _processSolidityEncodePackedArgs = function (arg) {
  /* jshint maxcomplexity:false */

  if (Array.isArray(arg)) {
    throw new Error('Autodetection of array types is not supported.');
  }

  let type; let 
    value = '';
  let hexArg; let 
    arraySize;

  // if type is given
  if (!!arg && typeof arg === 'object' && (arg.hasOwnProperty('v') || arg.hasOwnProperty('t') || arg.hasOwnProperty('value') || arg.hasOwnProperty('type'))) {
    type = arg.hasOwnProperty('t') ? arg.t : arg.type;
    value = arg.hasOwnProperty('v') ? arg.v : arg.value;

    // otherwise try to guess the type
  } else {
    type = utils.toHex(arg, true);
    value = utils.toHex(arg);

    if (!type.startsWith('int') && !type.startsWith('uint')) {
      type = 'bytes';
    }
  }

  if ((type.startsWith('int') || type.startsWith('uint')) && typeof value === 'string' && !/^(-)?0x/i.test(value)) {
    value = new BN(value);
  }

  // get the array size
  if (Array.isArray(value)) {
    arraySize = _parseTypeNArray(type);
    if (arraySize && value.length !== arraySize) {
      throw new Error(`${type} is not matching the given array ${JSON.stringify(value)}`);
    } else {
      arraySize = value.length;
    }
  }

  if (Array.isArray(value)) {
    hexArg = value.map((val) => _solidityPack(type, val, arraySize).toString('hex').replace('0x', ''));
    return hexArg.join('');
  } 
  hexArg = _solidityPack(type, value, arraySize);
  return hexArg.toString('hex').replace('0x', '');
};

/**
 * Hashes solidity values to a sha3 hash using keccak 256
 *
 * @method soliditySha3
 * @return {Object} the sha3
 */
const soliditySha3 = function () {
  /* jshint maxcomplexity:false */

  const args = Array.prototype.slice.call(arguments);

  const hexArgs = args.map(_processSolidityEncodePackedArgs);

  // console.log(args, hexArgs);
  // console.log('0x'+ hexArgs.join(''));

  return utils.sha3(`0x${hexArgs.join('')}`);
};

/**
 * Hashes solidity values to a sha3 hash using keccak 256 but does return the hash of value `null` instead of `null`
 *
 * @method soliditySha3Raw
 * @return {Object} the sha3
 */
const soliditySha3Raw = function () {
  return utils.sha3Raw(`0x${Array.prototype.slice.call(arguments).map(_processSolidityEncodePackedArgs).join('')}`);
};

/**
 * Encode packed args to hex
 *
 * @method encodePacked
 * @return {String} the hex encoded arguments
 */
const encodePacked = function () {
  /* jshint maxcomplexity:false */

  const args = Array.prototype.slice.call(arguments);

  const hexArgs = args.map(_processSolidityEncodePackedArgs);

  return `0x${hexArgs.join('').toLowerCase()}`;
};

export default {
  soliditySha3,
  soliditySha3Raw,
  encodePacked,
};
