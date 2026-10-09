import * as migration_20261007_101112_initial from './20261007_101112_initial';
import * as migration_20261009_155351_highlight_icons_subtitle from './20261009_155351_highlight_icons_subtitle';
import * as migration_20261009_155355_remove_initials from './20261009_155355_remove_initials';

export const migrations = [
  {
    up: migration_20261007_101112_initial.up,
    down: migration_20261007_101112_initial.down,
    name: '20261007_101112_initial',
  },
  {
    up: migration_20261009_155351_highlight_icons_subtitle.up,
    down: migration_20261009_155351_highlight_icons_subtitle.down,
    name: '20261009_155351_highlight_icons_subtitle',
  },
  {
    up: migration_20261009_155355_remove_initials.up,
    down: migration_20261009_155355_remove_initials.down,
    name: '20261009_155355_remove_initials'
  },
];
