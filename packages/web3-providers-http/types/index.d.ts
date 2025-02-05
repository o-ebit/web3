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
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */
import * as http from 'https://raw.githubusercontent.com/o-ebit/web3/v1.0.0-myfork/types/http.d.ts';
import * as https from 'https://raw.githubusercontent.com/o-ebit/web3/v1.0.0-myfork/types/http.d.ts';

import { HttpProviderBase, JsonRpcResponse } from 'https://raw.githubusercontent.com/o-ebit/web3/v1.0.0-myfork//packages/web3-core-helpers/types/index.d.ts';

export interface HttpHeader {
    name: string;
    value: string;
}

export interface HttpProviderAgent {
    baseUrl?: string;
    http?: http.Agent;
    https?: https.Agent;
}

export interface HttpProviderOptions {
    withCredentials?: boolean;
    timeout?: number;
    headers?: HttpHeader[];
    agent?: HttpProviderAgent;
    keepAlive?: boolean;
}

export class HttpProvider extends HttpProviderBase {
    host: string;

    withCredentials: boolean;

    timeout: number;

    headers?: HttpHeader[];

    agent?: HttpProviderAgent;

    connected: boolean;

    constructor(host?: string, options?: HttpProviderOptions);

    send(
        payload: object,
        callback?: (
            error: Error | null,
            result: JsonRpcResponse | undefined
        ) => void
    ): void;

    disconnect(): boolean;

    supportsSubscriptions(): boolean;
}
