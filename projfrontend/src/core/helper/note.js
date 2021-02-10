import {API} from "../../backend";

export const createNote = (userId, token, note) => {
  return fetch(`${API}/note/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: note,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getNotes = (userId, token) => {
  return fetch(`${API}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getNote = (userId, token, noteId) => {
  return fetch(`${API}/note/${noteId}/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getFile = (noteId, userId, token) => {
  return fetch(`${API}/note/${noteId}/file/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).catch((err) => {
    console.log(err);
  });
};

export const updateNote = (userId, token, noteId, note) => {
  return fetch(`${API}/note/${noteId}/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: note,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const removeNote = (userId, token, noteId) => {
  return fetch(`${API}/note/${noteId}/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
