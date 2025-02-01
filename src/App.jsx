import React,{useState} from 'react';
import { Button, Checkbox, Form, Input, Card, Row, Col, Typography, message,Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state


  const onFinish = async (values) => {
    setLoading(true); // Show loader
    try {
      // Send a POST request to your backend login endpoint
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
         mutation {
           login(email: "${values.username}", password: "${values.password}") {
            token
          } 
    }
        `,
      });

      // Extract the token from the response
      const token = response.data.data.login.token;

      // Save the token to localStorage or sessionStorage
      localStorage.setItem('token', token);

      // Show success message
      message.success('Login successful!');
      console.log('Token:', token);

      navigate('/dashboard');


      // Redirect to another page (e.g., dashboard)
      // window.location.href = '/dashboard';
    } catch (error) {
      // Handle errors
      console.error('Login failed:', error);
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Col xs={20} sm={16} md={12} lg={8}>
        <Card
          title={
            <Title level={2} style={{ textAlign: 'center', marginBottom: 0 }}>
              Login
            </Title>
          }
          bordered={false}
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
        >
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input placeholder="Enter your username" value={'john@example.com'} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" value={'securepassword123'} />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default App;