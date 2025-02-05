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
 * @file to-wei-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import BN = require('https://jspm.dev/bn.js');
import { toWei } from 'https://raw.githubusercontent.com/o-ebit/web3/v1.0.0-myfork//packages/web3-utils/src/index.js';

const bigNumber = new BN(3);

// $ExpectType string
toWei('1');
// $ExpectType BN
toWei(bigNumber);
// $ExpectType string
toWei('1', 'finney');
// $ExpectType BN
toWei(bigNumber, 'finney');

// $ExpectError
toWei(['string']);
// $ExpectError
toWei([4]);
// $ExpectError
toWei({});
// $ExpectError
toWei(true);
// $ExpectError
toWei(null);
// $ExpectError
toWei(undefined);
// $ExpectError
toWei(1, 'blah');
