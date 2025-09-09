import { Form, Input, Button, notification, Card, Row, Col, Select, InputNumber } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { createUserApi } from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const { Option } = Select;

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { name, email, password, address, phone, age, gender, province } = values;
        try {
            const res = await createUserApi(name, email, password, address, phone, age, gender, province);
            console.log('Register response:', res);
            if (res.data && res.data._id) {
                notification.success({
                    message: 'Đăng ký thành công',
                    description: 'Bạn đã đăng ký tài khoản thành công. Vui lòng đăng nhập.',
                });
                navigate('/login');
            } else if (res.data === null) {
                notification.error({
                    message: 'Đăng ký thất bại',
                    description: 'Email đã tồn tại, vui lòng chọn email khác',
                });
            } else {
                notification.error({
                    message: 'Đăng ký thất bại',
                    description: res.message || 'Có lỗi xảy ra, vui lòng thử lại sau',
                });
            }
        } catch (error) {
            console.error('Register error:', error);
            notification.error({
                message: 'Có lỗi xảy ra khi đăng ký',
                description: error.message || 'Vui lòng kiểm tra lại thông tin'
            });
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Col xs={20} sm={16} md={12} lg={8} xl={6}>
                <Card title="Đăng ký tài khoản" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <Form
                        name="register"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Họ và tên"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                        >
                            <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            label="Tuổi"
                            name="age"
                        >
                            <InputNumber min={1} style={{ width: '100%' }} placeholder="Tuổi" />
                        </Form.Item>

                        <Form.Item
                            label="Giới tính"
                            name="gender"
                        >
                            <Select placeholder="Chọn giới tính">
                                <Option value="Male">Nam</Option>
                                <Option value="Female">Nữ</Option>
                                <Option value="Other">Khác</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Tỉnh/Thành phố"
                            name="province"
                        >
                            <Input placeholder="Tỉnh/Thành phố" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterPage;
