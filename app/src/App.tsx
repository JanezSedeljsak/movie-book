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
import { useSelector, useDispatch } from 'react-redux';
import { AuthState } from './store/auth';
import { getActiveRouteStyle } from './util/helpers';
import { CenterSpin } from './components/centerspin';

const { Header, Content } = Layout;



function App() {
  const Routes = () => useRoutes(routes);
  const location = useLocation();
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const authData = useSelector((state: { auth: AuthState }) => state.auth);
  const isAuth = authData.token !== null;

  const makeActiveStyle = (urlPath: string): Object => {
    if (location.pathname === urlPath) {
      return getActiveRouteStyle();
    }

    return {};
  }

  const showProfileInfo = () => {
    Modal.info({
      title: 'You are logged in as:',
      content: (
        <div>
          <p>{authData.email}</p>
          <p>{authData.name}</p>
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
          <Suspense fallback={<CenterSpin />}>
            <Routes />
          </Suspense>
        </Content>
      </Layout>
      {isAuth
        ? <FloatButton
          onClick={() => showProfileInfo()}
          icon={<UserOutlined />}
          style={{ bottom: 106 }}
        />
        : null}
      <FloatButton onClick={() => {
        dispatch({ type: 'LOGOUT' });
        navigation('/login')
      }} icon={<LoginOutlined />} />
    </>
  )
}

export default App
