/*********************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
import { ContainerModule } from 'inversify';
import { cheWorkspaceServicePath, WorkspaceService } from '../common/workspace-service';

import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { OauthUtils } from './oauth-utils';
import { CertificateService, cheCertificateServicePath } from '../common/certificate-service';
import { cheFactoryServicePath, FactoryService } from '../common/factory-service';
import { cheOAuthServicePath, OAuthService } from '../common/oauth-service';
import { cheSshKeyServicePath, SshKeyService } from '../common/ssh-key-service';
import { cheTelemetryServicePath, TelemetryService } from '../common/telemetry-service';
import { cheUserServicePath, UserService } from '../common/user-service';

export default new ContainerModule(bind => {

    bind(CertificateService).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<CertificateService>(cheCertificateServicePath);
    }).inSingletonScope();

    bind(FactoryService).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<FactoryService>(cheFactoryServicePath);
    }).inSingletonScope();

    bind(OauthUtils).toSelf().inSingletonScope();
    bind(OAuthService).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<OAuthService>(cheOAuthServicePath);
    }).inSingletonScope();

    bind(SshKeyService).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<SshKeyService>(cheSshKeyServicePath);
    }).inSingletonScope();

    bind(TelemetryService).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<TelemetryService>(cheTelemetryServicePath);
    }).inSingletonScope();

    bind(UserService).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<UserService>(cheUserServicePath);
    }).inSingletonScope();

    bind(WorkspaceService).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<WorkspaceService>(cheWorkspaceServicePath);
    }).inSingletonScope();

});
