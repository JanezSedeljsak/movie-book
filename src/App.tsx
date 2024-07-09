import { Suspense } from 'react';
import { BrowserRouter, Link, useRoutes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import routes from '~react-pages';
import { Layout, Spin } from 'antd';

const { Header, Content } = Layout;

function App() {
  const Routes = () => useRoutes(routes)

  const fallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
      <Spin />
    </div>
  );

  return (
    <>
      <SnackbarProvider />
      <Layout>
        <Header>
          <h1 style={{ color: 'white' }}>Movie book</h1>
        </Header>
        <Content style={{ display: 'flex', padding: '0 50px', backgroundColor: '#eee' }}>
          <Suspense fallback={fallback()}>
            <Routes />
          </Suspense>
        </Content>
      </Layout>
    </>
  )
}

export default App
