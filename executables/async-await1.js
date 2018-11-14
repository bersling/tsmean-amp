var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getDatabaseConnection = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                status: 'connected'
            });
        }, 1500);
    });
};
const getUser = (con) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                name: 'Derp'
            });
        }, 1500);
    });
};
const getTodos = (con, user) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const todo1 = { todo: 'Launder' };
            const todo2 = { todo: 'Ironing' };
            resolve([todo1, todo2]);
        }, 1500);
    });
};
const getMyTodos = () => __awaiter(this, void 0, void 0, function* () {
    const con = yield getDatabaseConnection();
    console.log('Connection established!');
    const user = yield getUser(con);
    console.log('User fetched!');
    const todos = yield getTodos(con, user);
    console.log('Todos received.');
    return todos;
});
getMyTodos().then((todos) => {
    console.log(todos);
});
