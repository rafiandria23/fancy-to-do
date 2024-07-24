import _ from 'lodash';
import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { ApiRequest } from '@libs/api-common';

import { AuthMetadata } from './api-auth.constant';

export const Public = () => SetMetadata(AuthMetadata.PUBLIC, true);

export const Auth = createParamDecorator<
  unknown,
  ExecutionContext,
  ApiRequest['auth']
>((__, ctx) => {
  const request = ctx.switchToHttp().getRequest<ApiRequest>();

  return _.get(request, 'auth');
});
