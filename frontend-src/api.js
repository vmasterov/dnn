import { API_URL, LIMIT_DB } from "../helpers/constants";

const req = (url, options = {}) => {
  const { body } = options;

  return fetch((API_URL + url).replace(/\/\/$/, ""), {
    ...options,
    body: body ? JSON.stringify(body) : null,
    headers: {
      ...options.headers,
      ...(body
        ? {
            "Content-Type": "application/json",
          }
        : null),
    },
  }).then((res) => {
    return res.ok
      ? res.json()
      : res.text().then((message) => {
          throw new Error(message);
        });
  });
};

export const getNotes = ({ age, search, page } = {}) => {
  return req(`/?age=${age}&search=${search}&page=${page}&limit=${LIMIT_DB}`);
};

export const createNote = (title, text) => {
  const options = {
    method: "POST",
    body: { title, text },
  };

  return req("/", options).then(({ data }) => data);
};

export const getNote = (id) => {
  return req(`/${id}`).then(({ data }) => data);
};

export const archiveUnarchiveNote = (id, is_archive = false) => {
  const options = {
    method: "PATCH",
    body: { is_archive },
  };

  return req(`/${id}`, options);
};

export const editNote = (id, title, text) => {
  const options = {
    method: "PATCH",
    body: { id, title, text },
  };

  return req("/", options).then(({ data }) => data);
};

export const deleteNote = (id) => {
  const options = { method: "DELETE" };
  return req(`/${id}`, options);
};

export const deleteAllArchived = () => {
  const options = { method: "DELETE" };
  return req("/", options);
};

export const notePdfUrl = (id) => {
  const options = { method: "GET" };

  return req(`/${id}/pdf`, options).then((res) => {
    if (res.data && res.data.pdf && res.data.pdf.data) {
      const buffer = res.data.pdf.data;
      const arrayBuffer = new Uint8Array(buffer);
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      return { href: link.href, name: res.data.name };
    }

    return null;
  });
};
