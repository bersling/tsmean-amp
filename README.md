## Tutorial Page for the TSMEAN Project (an example of an AMP page)

This is the code the tsmean tutorial page at http://www.tsmean.com is built with.

This repository isn't interesting if you're interested in building a MEAN
application. If you're interested in how to build a a MEAN application visit the actual page at
http://www.tsmean.com. If, however, you think the
tsmean.com page has an awesome layout, loads really fast, or is somehow else
interesting and you'd like to build a page just like it, you've come to the right place.

The tsmean.com page is built with AMP. AMP stands for Accellerated Mobile Pages
and is a framework for super-fast loading pages. The layout
was inspired by the `apm-by-example` project.

## Installation

```
git clone https://github.com/bersling/ts-mean.git my-project
cd my-project
npm install
npm run build
npm start
```

Now you should have a server running at port 8080.

## Development

The project is compiled from multiple html-snippets into one single
index.html file. The templating language used is mustache. In order
to continuously watch your changes run
```
npm run watch
```

This only watches over changes that are mustache-related, so if you're
changing images for example, you'll have to rebuild using the
```
npm run build
```
command.

Since it's an AMP project, you'll have to be careful to follow the rules
of AMP. For instance, in an AMP project you're not allowed to use
the `<img>` tag. You'll have to use the `<amp-img>` tag. If you don't follow those rules
your page doesn't break, it just doesn't get the "AMP-SEO Bonus" anymore.

**Important:** You can check if you're writing valid AMP by appending `#development=1`
to the url,so for example
http://localhost:8080/#development=1
and then opening the chrome dev console.
It's very easily forgotten to append this bit to the URL, but if you don't
you won't see validation errors, but it will still say "Powered by AMP ⚡ HTML".
It only has validated your code if you also see "AMP validation successful." (or some errors)
in the dev console.



## Deployment
There's a small deploy script where you'll have to switch out
the server of this project with your own server. On your server you'll
furthermore need the following installed:

```
sudo apt-get install unzip
sudo apt-get install nginx

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

```

You will need to configure nginx accordingly.

Go to the `sites-available` directory, create a file called `tsmean`
(replace `tsmean` with what suits your project), and put
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
inside.

Then navigate to `sites-enabled` and symlink it:
```
ln -s ../sites-available/tsmean tsmean
```

To also score a bit better in page speed insights, modify the gzip part of the `nginx.conf`
as described here https://www.digitalocean.com/community/tutorials/how-to-add-the-gzip-module-to-nginx-on-ubuntu-14-04,
so it looks like
```
gzip on;
gzip_disable "msie6";

gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_buffers 16 8k;
gzip_http_version 1.1;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/vnd.ms-fontobject application/x-font-ttf font/opentype image/svg+xml image/x-icon;
```
