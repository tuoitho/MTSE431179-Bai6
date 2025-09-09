require("dotenv").config();
const User = require("../models/user");
const client = require('../config/elasticsearch');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createUserService = async (userData) => {
    try {
        const { name, email, password, address, phone, age, gender, province } = userData;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);
        let result = await User.create({
            name,
            email,
            password: hashPassword,
            role: "User",
            address,
            phone,
            age,
            gender,
            province
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return { EC: 2, EM: "Email/Password không hợp lệ" };
            } else {
                const payload = { email: user.email, name: user.name };
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRE }
                );
                return {
                    EC: 0,
                    access_token,
                    user: { email: user.email, name: user.name }
                };
            }
        } else {
            return { EC: 1, EM: "Email/Password không hợp lệ" };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getUserService = async (page = 1, pageSize = 10) => {
    try {
        const skip = (page - 1) * pageSize;
        const totalUsers = await User.countDocuments({});
        const users = await User.find({})
            .select("-password")
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        return {
            users,
            pagination: {
                current: page,
                pageSize,
                total: totalUsers,
                totalPages: Math.ceil(totalUsers / pageSize)
            }
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const searchUsersService = async (queryParams) => {
    const { query, filters, page = 1, pageSize = 10 } = queryParams;
    const from = (page - 1) * pageSize;

    const esQuery = {
        from,
        size: pageSize,
        query: {
            bool: {
                must: [],
                filter: []
            }
        },
        sort: [
            { "_score": "desc" },
            { "createdAt": "desc" }
        ]
    };

    // Thêm điều kiện tìm kiếm fuzzy
    if (query) {
        esQuery.query.bool.must.push({
            multi_match: {
                query,
                fields: ["name^3", "email"], // Ưu tiên trường 'name'
                fuzziness: "AUTO",
                prefix_length: 1
            }
        });
    } else {
        // Nếu không có query, trả về tất cả user (match_all)
        esQuery.query.bool.must.push({ match_all: {} });
    }

    // Thêm điều kiện lọc
    if (filters) {
        if (filters.gender) {
            esQuery.query.bool.filter.push({ term: { gender: filters.gender } });
        }
        if (filters.age_gte || filters.age_lte) {
            const ageRange = {};
            if (filters.age_gte) ageRange.gte = filters.age_gte;
            if (filters.age_lte) ageRange.lte = filters.age_lte;
            esQuery.query.bool.filter.push({ range: { age: ageRange } });
        }
    }

    try {

        const body = await client.search({
            index: 'users', // Tên index của bạn trong Elasticsearch
            body: esQuery
        });
        console.log(body.hits);
        const users = body.hits.hits.map(hit => hit._source);
        const total = body.hits.total.value;

        return {
            users,
            pagination: {
                current: page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        };
    } catch (error) {
        console.error('Elasticsearch search error:', error);
        return { users: [], pagination: {}, error: "Lỗi khi tìm kiếm" };
    }
};

module.exports = {
    createUserService,
    loginService,
    getUserService,
    searchUsersService // Export hàm mới
};
