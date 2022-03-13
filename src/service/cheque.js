import instance from "../libs/axios";

const GetChequelist = () => {
    return instance.get("/cheque");
}

const AddCheque = (payload) => {
    return instance.post("/cheque", payload);
}

const GetBalance = (payload) => {
    return instance.get(`/cheque/balance/${payload}`);
}

export default { GetChequelist, AddCheque, GetBalance };