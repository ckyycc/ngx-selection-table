import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { TestModule } from './test.module';

platformBrowserDynamic().bootstrapModule(TestModule)
  .catch(err => console.log(err));

