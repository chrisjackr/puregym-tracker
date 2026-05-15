CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE puregym_attendance (
    time TIMESTAMPTZ NOT NULL,
    gym_id INT NOT NULL,
    gym_attendance INT
);

SELECT create_hypertable('puregym_attendance', 'time');

CREATE UNIQUE INDEX uniq_time
ON puregym_attendance (gym_id, time DESC);

ALTER TABLE puregym_attendance
SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'gym_id'
);

SELECT add_compression_policy(
  'puregym_attendance',
  INTERVAL '7 days'
);

-- SELECT add_retention_policy(
--   'puregym_attendance',
--   INTERVAL '2 years'
-- );