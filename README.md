# Render it

School project

1) Build the stack
```bash
docker-compose build --no-cache
```

2) Launch it
```bash
docker-compose up
```

# Don't forget to
- If you're using VSCode make sure Prettier formats on save. Insert "editor.formatOnSave": true into your User Settings in VSCode.


# Utils

#### Down the stack
```bash
docker-compose down
```

#### Delete databases
```bash
sudo rm -rf mongo_data
```

this api run on port 4000
