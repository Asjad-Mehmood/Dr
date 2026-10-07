import * as migration_20261007_101112_initial from './20261007_101112_initial';

export const migrations = [
  {
    up: migration_20261007_101112_initial.up,
    down: migration_20261007_101112_initial.down,
    name: '20261007_101112_initial'
  },
];
