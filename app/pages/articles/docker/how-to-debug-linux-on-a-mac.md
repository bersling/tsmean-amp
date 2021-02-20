I recently encountered a bug that only appeared in our ubuntu CI server but not in my local dev environment, which is a mac. After unsuccessfully trying out 2, 3 things (pushing, waiting for the pipelines) I thought "there must be a better way, a way to test this locally". Of course, docker comes to mind.

It's actually really easy to set up linux on your mac without bending over backwards! You'll simply need a command like this:

```bash
docker run -it --volume /path/to/repo:/repo ubuntu bash
```

or if you have a specific image on your CI like in my case

```bash
docker run -it --volume /path/to/repo:/repo runnerimage bash
```

What's happening here:

- The repository volume is mapped in, so you can reproduce what's happening in linux
- You're starting an interactive session with `-it`: It's basically attaching you to the container. It's `--interactive + --tty`.

If you lose the connection to the container you can reattach to it with

```bash
docker exec -it container_name_or_id bash
```
