export default {
    request: {
        loading: false,
        message: {
            show: false,
            type: "success",
            text: ""
        }
    },
    form: {
        _id: 0,
        nome: "",
        descricao: "",
        data: "",
        status: {
            pendente: true,
            aprovado: false,
            reprovado: false,
            reportado: false
        }
    }
};
