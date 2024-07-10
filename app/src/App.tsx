import { Suspense } from 'react';
import { useRoutes, useNavigate, useLocation } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import routes from '~react-pages';
import { Layout, Spin, Button, FloatButton, Modal } from 'antd';
import {
  LoginOutlined,
  HomeOutlined,
  FileSearchOutlined,
  UnorderedListOutlined,
  PlayCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { AuthState } from './store/auth';

const { Header, Content } = Layout;

const activeRouteStyle = {
  boxShadow: 'rgba(50, 50, 93, 0.45) 0px 6px 12px -2px, rgba(0, 0, 0, 0.6) 0px 3px 7px -3px'
}

function App() {
  const Routes = () => useRoutes(routes);
  const location = useLocation();
  const navigation = useNavigate();

  const userEmail = useSelector((state: { auth: AuthState }) => state.auth.email);
  const isAuth = useSelector((state: { auth: AuthState }) => state.auth.token !== null);

  const fallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
      <Spin />
    </div>
  );

  const makeActiveStyle = (urlPath: string): Object => {
    if (location.pathname === urlPath) {
      return activeRouteStyle;
    }

    return {};
  }

  const showProfileInfo = () => {
    Modal.info({
      title: 'You are logged in as:',
      content: (
        <div>
          <p>{userEmail}</p>
        </div>
      ),
      onOk() { },
    });
  }

  return (
    <>
      <SnackbarProvider />
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ color: 'white', cursor: 'pointer' }} onClick={() => navigation('/')}><PlayCircleOutlined /> Movie book</h1>
          <Button className='link-button' onClick={() => navigation('/')} style={makeActiveStyle('/')}><HomeOutlined /> Home</Button>
          <Button className='link-button' onClick={() => navigation('/movies')} style={makeActiveStyle('/movies')}><FileSearchOutlined /> Search</Button>
          {isAuth ? <Button className='link-button' onClick={() => navigation('/watchlist')} style={makeActiveStyle('/watchlist')}><UnorderedListOutlined /> Watch-list</Button> : null}
        </Header>
        <Content style={{ display: 'flex', padding: '0 50px', backgroundColor: '#eee' }}>
          <Suspense fallback={fallback()}>
            <Routes />
          </Suspense>
        </Content>
      </Layout>
      {isAuth ? <FloatButton onClick={() => showProfileInfo()} icon={<UserOutlined />} style={{ bottom: 106 }} /> : null}
      <FloatButton onClick={() => navigation('/login')} icon={<LoginOutlined />} />
    </>
  )
}

export default App
