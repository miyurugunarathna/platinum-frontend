import instance from "../libs/axios";

const GetInvoicelist = () => {
    return instance.get("/invoice");
}

const AddInvoice = (payload) => {
    return instance.post("/invoice", payload);
}

const Payment = (payload) => {
    return instance.post("/invoice/payment", payload);
}

export default { GetInvoicelist, AddInvoice, Payment };