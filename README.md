## Exercise 22 — Containerized Phonebook Application

Original application repositories

- [Frontend (Part 2)](https://github.com/hoanguyen110900-hash/fullstackopen/tree/main/part2/phonebook)
- [Backend (Part 3)](https://github.com/hoanguyen110900-hash/fullstackopen/tree/main/part3/phonebook_backend)

### Run with Docker Compose

From `my-app`, start either production or development. Both publish port 8080, so stop one before starting the other.

Production

```sh
docker compose up --build
```

Development with hot reload

```sh
docker compose -f docker-compose.dev.yml up --build
```

Open [the phonebook](http://localhost:8080). The contact API is at `/api/persons` and the contact count is at `/info`. Development now uses the `my-app-dev` Compose project and its own MongoDB volume. A volume created under the previous default project name remains available under that name.
