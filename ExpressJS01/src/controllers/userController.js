const { createUserService, loginService, getUserService, searchUsersService } = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password, address, phone, age, gender, province } = req.body;
    const data = await createUserService({ name, email, password, address, phone, age, gender, province });
    return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
};

const getUser = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const data = await getUserService(page, pageSize);
    return res.status(200).json(data);
};

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
};

const searchUsers = async (req, res) => {
    console.log(">>> Query: ", req.query);
    const { q, gender, age_gte, age_lte, page, pageSize } = req.query;
    const filters = { gender, age_gte, age_lte };
    console.log(">>> Filters: ", filters);
    const data = await searchUsersService({
        query: q,
        filters,
        page: parseInt(page) || 1,
        pageSize: parseInt(pageSize) || 10
    });

    return res.status(200).json(data);
};

module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount,
    searchUsers // Export hàm mới
};
