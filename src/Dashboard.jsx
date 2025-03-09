import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Table, message, Spin, Grid, Popconfirm ,Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {  useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';

const Dashboard = () => {
  const { useBreakpoint } = Grid;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const handleInvalidToken = () => {
    message.error('Invalid Token. Logging out...');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Columns for the customer data table
  const columns = [
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Contact Number', dataIndex: 'customerContactNumber', key: 'customerContactNumber' },
    { 
      title: 'Date of Sale', 
      dataIndex: 'dateOfSale', 
      key: 'dateOfSale',
      render: (date) => dayjs(date).format('YYYY-MM-DD')
    },
    { title: 'Downpayment', dataIndex: 'totalDownPayment', key: 'totalDownPayment' },
    { title: 'Total Payment', dataIndex: 'totalPayment', key: 'totalPayment' },
    { title: 'Commission', dataIndex: 'commission', key: 'commission' },
    { title: 'Dealer Name', dataIndex: 'dealerName', key: 'dealerName' },
    { title: 'Plot Number', dataIndex: 'plotNumber', key: 'plotNumber' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
         <Space size="middle">
          <Button onClick={() => editCustomer(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            onConfirm={() => deleteCustomer(record.customerId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" style={{ marginLeft: 8 }}>Delete</Button>
          </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Authentication required');
        return;
      }

      const response = await axios.get('https://realtor-backend-kczm.onrender.com/api/customers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('response',response);
      
      
      setCustomers(response.data);
    } catch (error) {
      console.log('error',error);
      if (error.response.status === 400 && error.response.data.message === 'Invalid Token') {
        handleInvalidToken();
        return;
      }
      message.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const editCustomer = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setDrawerVisible(true);
  };

  const deleteCustomer = async (customerId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Authentication required');
        return;
      }

      const response = await axios.delete(`https://realtor-backend-kczm.onrender.com/api/customers/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 400 && response.data.message === 'Invalid Token') {
        handleInvalidToken();
        return;
      }
      message.success('Customer deleted successfully!');
      fetchCustomers(); // Refresh the list
    } catch (error) {
      console.log(error);
      if (error.response.status === 400 && error.response.data.message === 'Invalid Token') {
        handleInvalidToken();
        return;
      }
      
      message.error('Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Authentication required');
        return;
      }

      const response = await axios.put(`https://realtor-backend-kczm.onrender.com/api/customers/${editingCustomer.customerId}`, values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 400 && response.data.message === 'Invalid Token') {
        handleInvalidToken();
        return;
      }
      message.success('Customer updated successfully!');
      setDrawerVisible(false);
      form.resetFields();
      setEditingCustomer(null);
      fetchCustomers(); // Refresh the list
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message === 'Invalid Token') {
        handleInvalidToken();
        return;
      }
      message.error('Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
    console.log('values',values);
    if (editingCustomer) {
      await updateCustomer(values);
    } else {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          message.error('Authentication required');
          return;
        }

        const response = await axios.post('https://realtor-backend-kczm.onrender.com/api/customers', {
          customerName: values.customerName,
          customerContactNumber: values.customerContactNumber,
          totalDownPayment: values.totalDownPayment,
          totalPayment: values.totalPayment,
          commission: values.commission,
          dealerName: values.dealerName,
          plotNumber: values.plotNumber,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 400 && response.data.message === 'Invalid Token') {
          handleInvalidToken();
          return;
        }
        message.success('Customer created successfully!');
        setDrawerVisible(false);
        form.resetFields();
        fetchCustomers(); // Refresh the list
      } catch (error) {
        if (error.response.status === 400 && error.response.data.message === 'Invalid Token') {
          handleInvalidToken();
          return;
        }
        message.error('Failed to create customer');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Customers</h1>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setDrawerVisible(true)}
        disabled={loading}
      >
        Add Customer
      </Button>

      <Spin spinning={loading}>
        <Table
          dataSource={customers}
          columns={columns}
          style={{ marginTop: '20px' }}
          rowKey="customerId"
          scroll={{ x: true }} // Make table horizontally scrollable on small screens
        />
      </Spin>

      <Drawer
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        width={screens.xs ? '100%' : '400px'} // Adjust width based on screen size
        onClose={() => {
          setDrawerVisible(false);
          setEditingCustomer(null);
          form.resetFields();
        }}
        open={drawerVisible}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="customerContactNumber"
            label="Contact Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="totalDownPayment"
            label="Downpayment"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="totalPayment"
            label="Total Payment"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="commission"
            label="Commission"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="plotNumber"
            label="Plot Number"
            rules={[{ required: true }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            name="dealerName"
            label="Dealer Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Dashboard;

// import React, { useState } from 'react';
// import { Layout } from 'antd';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
// import SideMenu from './components/SideMenu.jsx';
// import DashboardContent from './components/DashboardContent.jsx';
// import CustomersContent from './components/CustomersContent.jsx';

// const { Header, Content } = Layout;

// const Dashboard = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <Router>
//       <Layout style={{ minHeight: '100vh' }}>
//         <SideMenu collapsed={collapsed} />
//         <Layout className="site-layout">
//           <Header className="site-layout-background" style={{ padding: 0 }}>
//             {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
//               className: 'trigger',
//               onClick: () => setCollapsed(!collapsed),
//             })}
//           </Header>
//           <Content style={{ margin: '0 16px' }}>
//             <Routes>
//               <Route path="/" element={<DashboardContent />} />
//               <Route path="/customers" element={<CustomersContent />} />
//             </Routes>
//           </Content>
//         </Layout>
//       </Layout>
//     </Router>
//   );
// };

// export default Dashboard;