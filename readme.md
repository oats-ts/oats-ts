# 🌱 oats

This project aims to provide a solution for generating quality Typescript code from API-describing documents. The only supported format currently is [OpenAPI 3.x](https://www.openapis.org), but there are plans to introduce generators for [AsyncAPI](https://www.asyncapi.com/) as well.

The goal is to minimize the boilerplate a human developer has to write, to reduce the tedium around keeping a client and a server in sync, and to allow devs to focus on just displaying or moving data, without worrying about the structural correctness of that data.

## why?

Why does this project exists? There are countless OpenAPI generators out there.

The main goals/differences are:

- Make it work for 1 language (Typescript), and do that well.
- Make every part of the API replaceable (without forking the project) in case it doesn't suit your needs.
- Make it easy to customize, to suit a wide variety of use cases out of the box.
- Make the generated code as easy to read, as if a dev would have written it by hand (or get as close to this as possible).

## docs & demo

https://oats-ts.github.io/docs
