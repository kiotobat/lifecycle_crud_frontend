import { useEffect, useState } from 'react';
import { pingAPI, getAPI, postAPI, deleteAPI } from './libs/api';
import Form from './components/Form/Form';
import Load from './components/Load/Load';
import NoteList from './components/NoteList/NoteList';
import ServerError from './components/ServerError/ServerError';
import Title from './components/Title/Title';

const App = () => {
  const [note, setNote] = useState(''); // текст заметки -> "Lorem"
  const [list, setList] = useState([]); // массив заметок [{id: 0, content: "Lorem"}, {...}, ...]
  const [status, setStatus] = useState('idle'); // статус подключения к серверу

  // первоначальная отрисовка компонента с данными, полученными с сервера:
  useEffect(() => {
    (async () => {
      // задержка появления лоадера в 1 секунду (чтобы не мелькал при перезагрузке страницы):
      const loaderTimeout = setTimeout(() => setStatus('pending'), 1000);
      const server = await pingAPI(); // подключение к серверу
      clearTimeout(loaderTimeout); // при быстром соединении с сервером лоадер не нужен

      if (server.status === 520) {
        setStatus('error'); // ошибка подключения к серверу
        return; // выходим и отрисовываем ошибку сервера
      }

      setStatus('success'); // связь с сервером установлена
      const data = await getAPI(); // GET-запрос на сервер
      setList(data); // ререндер (состояние list) -> актуализация массива заметок
    })();
  }, []);

  // обработчик cобытия 'change' на textarea:
  const handleChange = (textNote: string) => {
    setNote(textNote); // ререндер (состояние note) -> обновление поля textarea
  };

  // обработчик cобытия 'submit' на форме:
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    textNote: string
  ) => {
    event.preventDefault();
    if (!textNote) {
      setNote(''); // ререндер (состояние note) -> сброс невалидного textarea
      return;
    }

    await postAPI(note); // POST-запрос на сервер
    const data = await getAPI(); // GET-запрос на сервер
    setList(data); // ререндер (состояние list) -> актуализация массива заметок
    setNote(''); // ререндер (состояние note) -> очистка полей формы
  };

  const onRefresh = async () => {
    const data = await getAPI(); // GET-запрос на сервер
    setList(data); // ререндер (состояние list) -> актуализация массива заметок
    setNote(''); // ререндер (состояние note) -> очистка полей формы
  };

  const onRemove = async (id: number) => {
    await deleteAPI(id); // DELETE-запрос на сервер
    const data = await getAPI(); // GET-запрос на сервер
    setList(data); // ререндер (состояние list) -> актуализация массива заметок
  };

  return (
    <>
      {status === 'pending' && <Load />}
      {status === 'error' && <ServerError />}
      {status === 'success' && (
        <>
          <Title onRefresh={onRefresh} />
          <NoteList list={list} onRemove={onRemove} />
          <Form note={note} onChange={handleChange} onSubmit={handleSubmit} />
        </>
      )}
    </>
  );
};

export default App;
