const getDatabaseConnection: () => Promise<DatabaseConnection> = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          status: 'connected'
        })
      }, 1500);
    })
  }
  const getUser: (con: DatabaseConnection) => Promise<User> = (con) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          name: 'Derp'
        })
      }, 1500)
    })
  }
  const getTodos: (con: DatabaseConnection, user: User) => Promise<Todo[]> = (con, user) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const todo1 = {todo: 'Launder'};
            const todo2 = {todo: 'Ironing'};
            resolve([todo1, todo2]);
        }, 1500)
    })
  }
  const getMyTodos = async () => {
      const con = await getDatabaseConnection();
      console.log('Connection established!');
      const user = await getUser(con);
      console.log('User fetched!');
      const todos = await getTodos(con, user);
      console.log('Todos received.');
      return todos;
  }
  getMyTodos().then((todos) => {
      console.log(todos);
  });
  
  interface DatabaseConnection {
    status: 'connected' | 'disconnected';
  }
  interface User {
    name: string;
  }
  interface Todo {
    todo: string;
  }