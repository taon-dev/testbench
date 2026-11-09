import type { EnvOptions } from 'tnp/src';

const env: Partial<EnvOptions> = {
  website: {
    domain: 'testbench.example.domain.com',
    title: 'Testbench',
    useDomain: true,
  },
  loading: {
    preAngularBootstrap: {
      background: 'lightgray',
      loader: { name: 'lds-default' },
    },
  },
};
export default env;
