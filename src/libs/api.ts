import createRequest from "./createRequest";

// проверка связи с сервером:
export const pingAPI = async() => {
  const options = {
    method: 'GET',
    url: '/ping',
  };

  const data = await createRequest(options); // { status: 204, message: 'Server found!' }
  return data;
}

// GET-запрос на сервер - получение массива заметок:
export const getAPI = async () => {
  const options = {
    method: 'GET',
    url: '/notes',
  };

  const data = await createRequest(options);
  return data;
};

// POST-запрос на сервер - обновление массива заметок на сервере:
export const postAPI = async (note: string) => {
  const options = {
    method: 'POST',
    url: '/notes',
    body: {
      content: note,
    },
  };

  await createRequest(options);
};

// DELETE-запрос на сервер - удаление заметки на сервере по id:
export const deleteAPI = async (id: number) => {
  const options = {
    method: 'DELETE',
    url: `/notes/${id}`,
  };

  await createRequest(options);
};
