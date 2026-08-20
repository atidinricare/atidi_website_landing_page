import * as migration_20260227_textarea_to_richtext from './20260227_textarea_to_richtext';
import * as migration_20260402_set_status_published from './20260402_set_status_published';
import * as migration_20260423_opens_in_new_tab from './20260423_opens_in_new_tab';

export const migrations = [
  {
    up: migration_20260227_textarea_to_richtext.up,
    down: migration_20260227_textarea_to_richtext.down,
    name: '20260227_textarea_to_richtext'
  },
  {
    up: migration_20260402_set_status_published.up,
    down: migration_20260402_set_status_published.down,
    name: '20260402_set_status_published'
  },
  {
    up: migration_20260423_opens_in_new_tab.up,
    down: migration_20260423_opens_in_new_tab.down,
    name: '20260423_opens_in_new_tab'
  },
];
