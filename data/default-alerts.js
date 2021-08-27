const DefaultAlerts = Object.freeze([
  {
    command: 'final_score',
    frequency: 3600,
    'last-checked': null,
    'last-processed': null,
    'process-order': 1,
    'is-live': false
  },
  {
    command: 'get_final_score',
    frequency: 3600,
    'last-checked': null,
    'last-processed': null,
    'process-order': 2,
    'is-live': false
  },
  {
    command: 'update_diffs',
    frequency: 3600,
    'last-checked': null,
    'last-processed': null,
    'process-order': 3,
    'is-live': false
  },
  {
    command: 'get_diffs',
    frequency: 3600,
    'last-checked': null,
    'last-processed': null,
    'process-order': 4,
    'is-live': false
  },
  {
    command: 'league_individual',
    frequency: 3600,
    'last-checked': null,
    'last-processed': null,
    'process-order': 5,
    'is-live': false
  },
  {
    command: 'league_h2h',
    frequency: 3600,
    'last-checked': null,
    'last-processed': null,
    'process-order': 6,
    'is-live': false
  },
  {
    command: 'league_diffs',
    frequency: 3600,
    'last-checked': null,
    'last-processed': null,
    'process-order': 7,
    'is-live': false
  },
  {
    command: 'get_bonus',
    frequency: 3600,
    'last-checked': null,
    'last-processed': null,
    'process-order': 8,
    'is-live': false
  },
  {
    command: 'live_matches',
    frequency: 50,
    'last-checked': null,
    'last-processed': null,
    'process-order': 11,
    'is-live': true
  },
  {
    command: 'update_live',
    frequency: 50,
    'last-checked': null,
    'last-processed': null,
    'process-order': 12,
    'is-live': true
  },
  {
    command: 'update_teams',
    frequency: 1800,
    'last-checked': null,
    'last-processed': null,
    'process-order': 21,
    'is-live': true
  },
  {
    command: 'get_live_score',
    frequency: 100,
    'last-checked': null,
    'last-processed': null,
    'process-order': 31,
    'is-live': true
  },
  {
    command: 'get_bonus',
    frequency: 900,
    'last-checked': null,
    'last-processed': null,
    'process-order': 41,
    'is-live': true
  },
  {
    command: 'league_h2h',
    frequency: 300,
    'last-checked': null,
    'last-processed': null,
    'process-order': 51,
    'is-live': true
  },
  {
    command: 'personal_fast',
    frequency: 300,
    'last-checked': null,
    'last-processed': null,
    'process-order': 52,
    'is-live': true
  },
  {
    command: 'league_diffs',
    frequency: 900,
    'last-checked': null,
    'last-processed': null,
    'process-order': 61,
    'is-live': true
  },
  {
    command: 'update_diffs',
    frequency: 900,
    'last-checked': null,
    'last-processed': null,
    'process-order': 62,
    'is-live': true
  },
  {
    command: 'get_diffs',
    frequency: 900,
    'last-checked': null,
    'last-processed': null,
    'process-order': 63,
    'is-live': true
  },
  {
    command: 'league_individual',
    frequency: 2400,
    'last-checked': null,
    'last-processed': null,
    'process-order': 71,
    'is-live': true
  },
  {
    command: 'personal_slow',
    frequency: 2400,
    'last-checked': null,
    'last-processed': null,
    'process-order': 72,
    'is-live': true
  },
]);

module.exports = { DefaultAlerts }