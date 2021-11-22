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
 * @file Registry.js
 *
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

'use strict';

import Contract from 'https://deno.land/x/web3@v0.7.3/packages/web3-eth-contract/src/index.js';
import namehash from 'https://jspm.dev/eth-ens-namehash';
import PromiEvent from 'https://deno.land/x/web3@v0.7.3/packages/web3-core-promievent/src/index.js';
import { formatters } from 'https://deno.land/x/web3@v0.7.3/packages/web3-core-helpers/src/index.js';
import utils from 'https://deno.land/x/web3@v0.7.3/packages/web3-utils/src/index.js';
import REGISTRY_ABI from '../resources/ABI/Registry.js';
import RESOLVER_ABI from '../resources/ABI/Resolver.js';

/**
 * A wrapper around the ENS registry contract.
 *
 * @method Registry
 * @param {Ens} ens
 * @constructor
 */
function Registry(ens) {
  const self = this;
  this.ens = ens;
  this.contract = ens.checkNetwork().then((address) => {
    const contract = new Contract(REGISTRY_ABI, address);
    contract.setProvider(self.ens.eth.currentProvider);

    return contract;
  });
}

/**
 * Returns the address of the owner of an ENS name.
 *
 * @deprecated Please use the "getOwner" method instead of "owner"
 *
 * @method owner
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<string>}
 */
Registry.prototype.owner = function (name, callback) {
  console.warn('Deprecated: Please use the "getOwner" method instead of "owner".');

  return this.getOwner(name, callback);
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method getOwner
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<string>}
 */
Registry.prototype.getOwner = function (name, callback) {
  const promiEvent = new PromiEvent(true);

  this.contract.then((contract) => contract.methods.owner(namehash.hash(name)).call()).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setOwner
 *
 * @param {string} name
 * @param {string} address
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
Registry.prototype.setOwner = function (name, address, txConfig, callback) {
  const promiEvent = new PromiEvent(true);

  this.contract.then((contract) => contract.methods.setOwner(namehash.hash(name), formatters.inputAddressFormatter(address)).send(txConfig)).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Returns the TTL of the given node by his name
 *
 * @method getTTL
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returnss {Promise<string>}
 */
Registry.prototype.getTTL = function (name, callback) {
  const promiEvent = new PromiEvent(true);

  this.contract.then((contract) => contract.methods.ttl(namehash.hash(name)).call()).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setTTL
 *
 * @param {string} name
 * @param {number} ttl
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
Registry.prototype.setTTL = function (name, ttl, txConfig, callback) {
  const promiEvent = new PromiEvent(true);

  this.contract.then((contract) => contract.methods.setTTL(namehash.hash(name), ttl).send(txConfig)).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setSubnodeOwner
 *
 * @param {string} name
 * @param {string} label
 * @param {string} address
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
Registry.prototype.setSubnodeOwner = function (name, label, address, txConfig, callback) {
  const promiEvent = new PromiEvent(true);

  if (!utils.isHexStrict(label)) {
    label = utils.sha3(label);
  }

  this.contract.then((contract) => contract.methods.setSubnodeOwner(
    namehash.hash(name),
    label,
    formatters.inputAddressFormatter(address),
  ).send(txConfig)).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Sets the owner, resolver, and TTL for an ENS record in a single operation.
 *
 * @method setRecord
 *
 * @param {string} name
 * @param {string} owner
 * @param {string} resolver
 * @param {string | number} ttl
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
Registry.prototype.setRecord = function (name, owner, resolver, ttl, txConfig, callback) {
  const promiEvent = new PromiEvent(true);

  this.contract.then((contract) => contract.methods.setRecord(
    namehash.hash(name),
    formatters.inputAddressFormatter(owner),
    formatters.inputAddressFormatter(resolver),
    ttl,
  ).send(txConfig)).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Sets the owner, resolver and TTL for a subdomain, creating it if necessary.
 *
 * @method setSubnodeRecord
 *
 * @param {string} name
 * @param {string} label
 * @param {string} owner
 * @param {string} resolver
 * @param {string | number} ttl
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
Registry.prototype.setSubnodeRecord = function (name, label, owner, resolver, ttl, txConfig, callback) {
  const promiEvent = new PromiEvent(true);

  if (!utils.isHexStrict(label)) {
    label = utils.sha3(label);
  }

  this.contract.then((contract) => contract.methods.setSubnodeRecord(
    namehash.hash(name),
    label,
    formatters.inputAddressFormatter(owner),
    formatters.inputAddressFormatter(resolver),
    ttl,
  ).send(txConfig)).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Sets or clears an approval by the given operator.
 *
 * @method setApprovalForAll
 *
 * @param {string} operator
 * @param {boolean} approved
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
Registry.prototype.setApprovalForAll = function (operator, approved, txConfig, callback) {
  const promiEvent = new PromiEvent(true);

  this.contract.then((contract) => contract.methods.setApprovalForAll(formatters.inputAddressFormatter(operator), approved).send(txConfig)).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Returns true if the operator is approved
 *
 * @method isApprovedForAll
 *
 * @param {string} owner
 * @param {string} operator
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<boolean>}
 */
Registry.prototype.isApprovedForAll = function (owner, operator, callback) {
  const promiEvent = new PromiEvent(true);

  this.contract.then((contract) => contract.methods.isApprovedForAll(
    formatters.inputAddressFormatter(owner),
    formatters.inputAddressFormatter(operator),
  ).call()).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Returns true if the record exists
 *
 * @method recordExists
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<boolean>}
 */
Registry.prototype.recordExists = function (name, callback) {
  const promiEvent = new PromiEvent(true);

  this.contract.then((contract) => contract.methods.recordExists(namehash.hash(name)).call()).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Returns the resolver contract associated with a name.
 *
 * @deprecated Please use the "getResolver" method instead of "resolver"
 *
 * @method resolver
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Contract>}
 */
Registry.prototype.resolver = function (name, callback) {
  console.warn('Deprecated: Please use the "getResolver" method instead of "resolver".');

  return this.getResolver(name, callback);
};

/**
 * Returns the resolver contract associated with a name.
 *
 * @method getResolver
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Contract>}
 */
Registry.prototype.getResolver = function (name, callback) {
  const self = this;

  return this.contract.then((contract) => contract.methods.resolver(namehash.hash(name)).call()).then((address) => {
    const contract = new Contract(RESOLVER_ABI, address);
    contract.setProvider(self.ens.eth.currentProvider);

    if (typeof callback === 'function') {
      // It's required to pass the contract to the first argument to be backward compatible and to have the required consistency
      callback(contract, contract);

      return;
    }

    return contract;
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    throw error;
  });
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setResolver
 *
 * @param {string} name
 * @param {string} address
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
Registry.prototype.setResolver = function (name, address, txConfig, callback) {
  const promiEvent = new PromiEvent(true);

  this.contract.then((contract) => contract.methods.setResolver(namehash.hash(name), formatters.inputAddressFormatter(address)).send(txConfig)).then((receipt) => {
    if (typeof callback === 'function') {
      // It's required to pass the receipt to the first argument to be backward compatible and to have the required consistency
      callback(receipt, receipt);

      return;
    }

    promiEvent.resolve(receipt);
  }).catch((error) => {
    if (typeof callback === 'function') {
      callback(error, null);

      return;
    }

    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

export default Registry;
