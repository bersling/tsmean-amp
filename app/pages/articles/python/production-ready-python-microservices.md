(Insert boilerplate blabla here why microservices are cool. But let's cut to the chase.)

## The framework

A good web framework for python microservices is flask. It's simple and it's lightweight. Its main competitor django is more of a full-on solution that comes with things like an admin interface and multilingual support and whatnot. But you're probably more concerned with a JSON in, JSON out "API style" kind of thing. And for that, flask is perfect.

## The webserver

Now it would be nice if you could just run "python myapp.py", 

Python webservers rely on WSGI. In very simple terms: There's an interface (the Web Server Gateway Interface) that python web frameworks usually implement. This allows web servers to be decoupled from the web frameworks. The interface allows the server to load the application in a standardized way, it's a contract that allows the two to communicate. It works, as long as the server and the framework are WSGI compliant. And basically all python web servers and frameworks are.

The industry standard for a web server is Gunicorn. Don't ask me why, 