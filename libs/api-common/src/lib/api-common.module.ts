import { Module } from '@nestjs/common';

import { ApiCommonService } from './api-common.service';

@Module({
  providers: [ApiCommonService],
  exports: [ApiCommonService],
})
export class ApiCommonModule {}
