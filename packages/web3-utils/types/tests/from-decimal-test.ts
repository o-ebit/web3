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
 * @file from-decimal-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import BN = require('https://jspm.dev/bn.js');
import { fromDecimal } from 'https://raw.githubusercontent.com/o-ebit/web3/v1.0.0-myfork//packages/web3-utils/src/index.js';

// $ExpectType string
fromDecimal('232');
// $ExpectType string
fromDecimal(232);

// $ExpectError
fromDecimal(new BN(3));
// $ExpectError
fromDecimal(['string']);
// $ExpectError
fromDecimal([4]);
// $ExpectError
fromDecimal({});
// $ExpectError
fromDecimal(true);
// $ExpectError
fromDecimal(null);
// $ExpectError
fromDecimal(undefined);
