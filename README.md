# Render it - Apis

A swagger documentation is reacheable on http://localhost:4000/docs

School project

1) Build the stack
```bash
docker-compose build --no-cache
```

2) Launch it
```bash
docker-compose up
```

3) As a deamon
```
docker-compose up -d
```

# Don't forget to
If you're using VSCode make sure Prettier formats on save. Insert "editor.formatOnSave": true into your user settings.


# Utils

#### Down the stack
```bash
docker-compose down
```

#### Delete database
```bash
sudo rm -rf mongo_data
```

this api run on port 3000
