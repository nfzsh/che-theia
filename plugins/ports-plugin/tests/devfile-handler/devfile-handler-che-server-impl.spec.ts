/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as fs from "fs";
import { CheServerDevfileHandlerImpl } from '../../src/devfile-handler-che-server-impl';
import { DevfileHandler } from '../../src/devfile-handler';

import * as che from '@eclipse-che/plugin';
import { EndpointCategory, EndpointExposure } from "../../src/endpoint";

describe("Test Workspace Endpoints", () => {

    let devfileHandler: DevfileHandler;

    const OLD_ENV = process.env;

    beforeEach(() => {
        devfileHandler = new CheServerDevfileHandlerImpl();
        jest.resetModules()
        process.env = { ...OLD_ENV };
        });


  afterAll(() => {
    process.env = OLD_ENV;
  });

    test("test fail workspace", async () => {

        const endpoints = await devfileHandler.getEndpoints();
        expect(endpoints).toBeDefined();
        expect(Array.isArray(endpoints)).toBe(true);
        expect(endpoints.length).toBe(0);

    });

    test("test ports opened", async () => {

        const output = fs.readFileSync(__dirname + "/workspace-output.json");

        (che as any).setWorkspaceOutput(output);

        // jwt proxy
        process.env.SERVERU2DZ64P8_JWTPROXY_SERVICE_PORT_SERVER_4401='4401';
        process.env.SERVERU2DZ64P8_JWTPROXY_SERVICE_PORT_SERVER_4400='4400';
        process.env.SERVERU2DZ64P8_JWTPROXY_SERVICE_PORT_SERVER_4402='4402';
        process.env.SERVERU2DZ64P8_JWTPROXY_SERVICE_PORT_SERVER_EMPTY='';
        process.env.SERVERU2DZ64P8_JWTPROXY_SERVICE_PORT_SERVER_INVALID='invalid';

        // telemetry
        process.env.CHE_WORKSPACE_TELEMETRY_BACKEND_PORT = '4167';

        const endpoints = await devfileHandler.getEndpoints();

        expect(endpoints).toBeDefined();
        expect(Array.isArray(endpoints)).toBe(true);
        expect(endpoints.length).toBe(13);

        expect(endpoints[0].targetPort).toBe(4444);
        expect(endpoints[0].url).toBe('wss://routewxrk0x26-dummy-che.8a09.starter-us-east-2.openshiftapps.com');
        expect(endpoints[0].name).toBe('che-machine-exec');

        // check we have JTW proxy endpoints
        const jwtEndpoints = endpoints.filter(endpoint => endpoint.type === 'jwt-proxy');
        expect(jwtEndpoints.length).toBe(3);
        jwtEndpoints.forEach(jwtEndpoint=> {
            expect(jwtEndpoint.category).toBe(EndpointCategory.PLUGINS);
            expect(jwtEndpoint.exposure).toBe(EndpointExposure.DEVFILE_PRIVATE);
            expect(jwtEndpoint.url).toBe('');
            expect(jwtEndpoint.protocol).toBe('tcp');
            expect(jwtEndpoint.url).toBe('');
        })
    });

});
