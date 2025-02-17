import type { FormProps } from 'antd';
import { Button, Card, Form, Input, Spin } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import DirectusService from '@/services/directus';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { CenterSpin } from '@/components/centerspin';

type FieldType = {
    email?: string;
    password?: string;
};

function CardTitle() {
    return (
        <h2 style={{ color: '#2c3e50' }}>
            <PlayCircleFilled /> Login
        </h2>
    );
}

export default function Login() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        try {
            const credentials = await DirectusService.login(
                values.email as string,
                values.password as string
            );

            dispatch({
                type: 'LOGIN', payload: {
                    email: credentials.email,
                    token: credentials.access_token,
                    userId: credentials.id,
                    name: `${credentials.first_name} ${credentials.last_name}`
                }
            });

            enqueueSnackbar('You have successfully logged in!', {
                variant: 'success'
            });

            navigator('/');
        } catch (error) {
            enqueueSnackbar('Invalid credentials!', {
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    if (isLoading) {
        return <CenterSpin />
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <Card id="outer-auth-card">
                <Card id="auth-card" title={<CardTitle />} bordered={false}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ width: 480 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input type="email" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Card>
        </div>
    );
}