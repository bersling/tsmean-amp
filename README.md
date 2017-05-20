Run:

Go to project folder in terminal, then

python -m SimpleHTTPServer 8002


Validate AMP:

Open URL:
http://localhost:8002/#development=1

in browser, then open chrome dev console.


TODOs:

- Actually add descriptions
- If there's a gitignore, well you should have git...


### Configure Nginx

Go to sites available, create tsmean, and put
```
upstream tsmean {
  server localhost:8080;
}

server {
  server_name  tsmean.com;
  return       301 http://www.tsmean.com$request_uri;
}

server {
  server_name www.tsmean.com;
  location / {
    proxy_pass http://tsmean;
  }
}

```
inside

Then go to sites-enabled and symlink it
```
ln -s ../sites-available/tsmean tsmean
```
