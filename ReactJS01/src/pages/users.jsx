// src/pages/users.jsx
import { Card, Button, Space, Typography, Spin, message, Table, Input, Row, Col, Select, Form } from 'antd'; // Thêm Input, Row, Col, Select, Form
import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';
import { getUsersApi, searchUsersApi } from '../utils/api'; // Import hàm search
import { useDebounce } from 'use-debounce'; // Cài đặt thư viện này: npm install use-debounce

const { Title } = Typography;
const { Option } = Select;

const UserPage = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    
    const [form] = Form.useForm();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Debounce 500ms

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5, // Giảm pageSize để dễ test
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
        pageSizeOptions: ['5', '10', '20', '50'],
    });

    const fetchUsers = useCallback(async (params = {}, showMessage = false) => {
        setLoading(true);
        try {
            let res;
            // Nếu có query hoặc filter, gọi API search, ngược lại gọi API cũ
            if (params.q || params.gender || params.age_gte || params.age_lte) {
                res = await searchUsersApi(params);
            } else {
                res = await getUsersApi(params.page, params.pageSize);
            }

            if (res && res.users) {
                setUserList(res.users);
                setPagination(prev => ({
                    ...prev,
                    current: res.pagination.current,
                    pageSize: res.pagination.pageSize,
                    total: res.pagination.total,
                }));
                if (showMessage) message.success('Làm mới danh sách thành công');
            } else {
                message.error(res.message || 'Không thể tải danh sách người dùng.');
                if (res.EC === -1 || res.status === 401) {
                    setAuth({ isAuthenticated: false, user: { email: '', name: '' } });
                    navigate('/login');
                }
            }
        } catch (e) {
            console.error('fetchUsers error', e);
            message.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    }, [navigate, setAuth]);

    useEffect(() => {
        const filters = form.getFieldsValue();
        const params = {
            page: pagination.current,
            pageSize: pagination.pageSize,
            q: debouncedSearchQuery,
            ...filters
        };
        fetchUsers(params);
    }, [debouncedSearchQuery, pagination.current, pagination.pageSize, fetchUsers, form]);
    
    const handleTableChange = (paginationParams) => {
        setPagination(prev => ({...prev, ...paginationParams}));
    };

    const handleFilterChange = () => {
        // Reset về trang 1 khi filter thay đổi
        setPagination(prev => ({...prev, current: 1}));
        const filters = form.getFieldsValue();
        const params = {
            page: 1,
            pageSize: pagination.pageSize,
            q: searchQuery,
            ...filters
        };
        fetchUsers(params);
    };

    const handleRefresh = () => {
        form.resetFields();
        setSearchQuery('');
        setPagination(prev => ({ ...prev, current: 1 }));
        fetchUsers({ page: 1, pageSize: pagination.pageSize }, true);
    }
    
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Province',
            dataIndex: 'province',
            key: 'province',
        },
    ];

    return (
        <div style={{ maxWidth: 960, margin: '32px auto', padding: '0 16px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Danh sách người dùng</Title>
            <Card bordered hoverable>
                <Form form={form} onValuesChange={handleFilterChange} layout="vertical">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="q">
                                <Input.Search
                                    placeholder="Tìm kiếm theo tên, email, địa chỉ..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="gender" label="Giới tính">
                                <Select placeholder="Chọn giới tính" allowClear>
                                    <Option value="">Tất cả</Option>
                                    <Option value="Male">Nam</Option>
                                    <Option value="Female">Nữ</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Tuổi từ">
                                <Form.Item name="age_gte" noStyle>
                                    <Input type="number" placeholder="Từ" />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Đến tuổi">
                                <Form.Item name="age_lte" noStyle>
                                    <Input type="number" placeholder="Đến" />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                 <Space style={{ marginBottom: 16 }}>
                    <Button onClick={handleRefresh} loading={loading}>Làm mới</Button>
                    <Button type="primary" onClick={() => navigate('/')}>Về trang chủ</Button>
                 </Space>
                <Table
                    dataSource={userList}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                    bordered
                    pagination={pagination}
                    onChange={handleTableChange}
                />
            </Card>
        </div>
    );
};

export default UserPage;
