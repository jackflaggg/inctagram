import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../core/exceptions/incubator-exceptions/filter/all-exceptions-filter';
import { DomainExceptionsFilter } from '../core/exceptions/incubator-exceptions/filter/domain-exceptions-filter';
import { ZodFilter } from '../core/exceptions/zod-exceptions/zod.exception-filter';

export function exceptionFilterSetup(app: INestApplication) {
    //Подключаем наши фильтры. Тут важна последовательность! (сработает справа на лево)
    app.useGlobalFilters(new ZodFilter());
    // app.useGlobalGuards(new BasicAuthGuard());
}
