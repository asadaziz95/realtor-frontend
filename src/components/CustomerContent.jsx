import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Table, message, Spin, Grid } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

const CustomersContent = () => {
  const { useBreakpoint } = Grid;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const screens = useBreakpoint();

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
      setCustomers(response.data);
    } catch (error) {
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

  const updateCustomer = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Authentication required');
        return;
      }

      await axios.put(`https://realtor-backend-kczm.onrender.com/api/customers/${editingCustomer.customerId}`, values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      message.success('Customer updated successfully!');
      setDrawerVisible(false);
      form.resetFields();
      setEditingCustomer(null);
      fetchCustomers(); // Refresh the list
    } catch (error) {
      message.error('Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
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
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        message.success('Customer created successfully!');
        setDrawerVisible(false);
        form.resetFields();
        fetchCustomers(); // Refresh the list
      } catch (error) {
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
          columns={[
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
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Button onClick={() => editCustomer(record)}>Edit</Button>
              ),
            },
          ]}
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
        visible={drawerVisible}
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

export default CustomersContent;