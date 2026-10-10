import * as migration_20261007_101112_initial from './20261007_101112_initial';
import * as migration_20261009_155351_highlight_icons_subtitle from './20261009_155351_highlight_icons_subtitle';
import * as migration_20261009_155355_remove_initials from './20261009_155355_remove_initials';
import * as migration_20261009_181153_blob_object_key from './20261009_181153_blob_object_key';
import * as migration_20261010_033741_ai_highlights from './20261010_033741_ai_highlights';

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
    name: '20261009_155355_remove_initials',
  },
  {
    up: migration_20261009_181153_blob_object_key.up,
    down: migration_20261009_181153_blob_object_key.down,
    name: '20261009_181153_blob_object_key',
  },
  {
    up: migration_20261010_033741_ai_highlights.up,
    down: migration_20261010_033741_ai_highlights.down,
    name: '20261010_033741_ai_highlights'
  },
];
