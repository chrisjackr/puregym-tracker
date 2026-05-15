# PureGym Attendance App

A fullstack application to collect, store and display attendance data for PureGyms.

## Installation

WORK IN PROGRESS

## Usage

WORK IN PROGRESS

1. Copy `.env.example` into `.env` and update password values.
2. Create external Docker volume:
```bash
docker volume create timescaledb_data
```
3. Start services:
```bash
cd ./backend
docker compose up
cd ./frontend
docker compose up
```

4. Stopping services:
```bash
cd ./backend
docker compose down
cd ./frontend
docker compose down

# Optional - delete database volume
docker volume rm timescaledb_data
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

See `LICENSE.txt`.